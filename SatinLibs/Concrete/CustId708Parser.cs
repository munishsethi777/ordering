﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MVCEF.Infrastructure;
using System.Data;
using System.Web;
using System.Data.OleDb;
using org.apache;
using org.apache.pdfbox.pdmodel;
using org.apache.pdfbox.util;
using System.Globalization;
namespace SatinLibs
{
    public class CustId708Parser : ParserI
    {
        TempOrder tempOrder = null;
        private int pageCount = 1;
        private int customerId;
        private int productCount = 0;
        private int productRowsCount = 0;
        private static string firstLineText = "Purchase Order No.";
        private static string pageFooterText = "The goods are purchased in accordance with the specification on this purchase order and the terms and";
        public DataSet getDataSet(string _customerId, string fileLocation)
        {
            
            customerId = int.Parse(_customerId);
            string pdfText = getTextFromPDF(fileLocation);
            string[] allLines = pdfText.Split(new string[] { "\r\n" }, StringSplitOptions.None);
            DataSet dataSet = new DataSet();
            int[] startingLinesIndexes = getStartingLinesIndexes(allLines, pageCount);
            if (startingLinesIndexes.Length == 1)
            {
                getPDFSheetToDataSet(allLines, dataSet);
            }
            else
            {
                
                if (pageCount == startingLinesIndexes.Length)
                {
                    for (int i = 0; i < pageCount; i++)
                    {
                        int startIndex = startingLinesIndexes[i];
                        int endIndex;
                        if (i == pageCount - 1)
                        {
                            endIndex = allLines.Length;
                        }
                        else
                        {
                            endIndex = startingLinesIndexes[i + 1];
                        }

                        string[] lines = getSheetLines(startIndex, endIndex, allLines);
                        getPDFSheetToDataSet(lines, dataSet);
                    }
                }
            }
            return dataSet;
        }

        private int[] getStartingLinesIndexes(string[] lines, int pageCount)
        {
            List<int> startingIndexesList = new List<int>();
            for (int i = 0; i < lines.Length; i++)
            {
                if (lines[i].Equals(firstLineText))
                {
                    startingIndexesList.Add(i);
                }
            }
            int[] startingLinesIndexes = startingIndexesList.ToArray();
            return startingLinesIndexes;
        }

        private string[] getSheetLines(int start, int last, string[] allLines)
        {
            string[] lines = new string[last - start];
            int index = 0;
            for (int i = start; i < last; i++)
            {
                lines[index++] = allLines[i];
            }
            return lines;
        }

        private void getPDFSheetToDataSet(string[] lines, DataSet dataSet)
        {
            DataSet storesDataSet = CustomerUtils.getStores(customerId);
            int storesCount = 0;
            if (storesDataSet != null)
            {
                storesCount = storesDataSet.Tables[0].Rows.Count;
            }
            productCount = productsCount(lines);
            string supplierId = lines[14];
            string orderNo = lines[8] ;
            string orderDate = lines[9];
            string deliveryDate = lines[10];
            Decimal orderAmount = getTotalAmount(lines);
            string format = "dd/MM/yyyy";

            tempOrder = new TempOrder();
            tempOrder.Seq = 0;
            tempOrder.OrderId = orderNo;
            tempOrder.OrderDate = DateTime.ParseExact(orderDate, format, CultureInfo.InvariantCulture);
            tempOrder.CreatedOn = new DateTime();
            tempOrder.CustomerId = supplierId;
            tempOrder.Remarks = getAddress(lines);
            tempOrder.DeliveryDate = DateTime.ParseExact(deliveryDate, format, CultureInfo.InvariantCulture);
            tempOrder.Amount = orderAmount;


            List<TempOrderDetails> orderDetailList = getDetailsList(lines, productCount);
            String storeCode = orderDetailList[0].StoreId;
            tempOrder.OrderDetails = orderDetailList;
            DataSetUtils utils = new DataSetUtils();
            DataSet mainDs = utils.ToDataSet(tempOrder);
            DataTable dt = getCommonDataTable(productCount, storeCode);
            DataSet ds = new DataSet();
            for (int i = 0; i < productCount; i++)
            {
                DataRow row = mainDs.Tables[0].Rows[i];
                string orderNumber = row.ItemArray[2].ToString();
                string itemNo = row.ItemArray[4].ToString();
                string itemName = row.ItemArray[5].ToString();
                string price = row.ItemArray[6].ToString();
                object[] array = new object[6];
                array[0] = orderNumber;
                array[1] = itemNo;
                array[2] = itemName;
                array[3] = price;
                array[4] = row.ItemArray[7].ToString();
                string remarks = row.ItemArray[9].ToString();
                array[5] = remarks;
                dt.Rows.Add(array);
            }
            dataSet.Tables.Add(dt);
        }
        
        public DataTable getCommonDataTable(int totalRowsCount, String storeCode)
        {
            DataTable mytable = new DataTable();
            mytable.Columns.Add("Order#");
            mytable.Columns.Add("Sl#");
            mytable.Columns.Add("Product");
            mytable.Columns.Add("Price");
            mytable.Columns.Add(storeCode);
            mytable.Columns.Add("Remarks");
            return mytable;
        }

        private string getTextFromPDF(String fileLocation)
        {
            PDDocument doc = PDDocument.load(fileLocation);
            pageCount = doc.getNumberOfPages();
            PDFTextStripper stripper = new PDFTextStripper();
            String txt = stripper.getText(doc);
            return txt;
        }

        private int productsCount(string[] lines)
        {
            string totalPurchaseLineText = "Total No of Items ";
            string countText = "0";
            for (int i = 0; i < lines.Length; i++)
            {
                if (lines[i].StartsWith(totalPurchaseLineText))
                {
                    countText = lines[i];
                    countText = countText.Substring(18);
                    countText = countText.Substring(0,countText.IndexOf("Total")).Trim();
                    continue;
                }
            }
            return int.Parse(countText);
        }
        private decimal getTotalAmount(string[] lines)
        {
            string totalAmountText = "Total Net Amount ";
            for (int i = 0; i < lines.Length; i++)
            {
                if (lines[i].Contains(totalAmountText))
                {
                    
                    string lineText = lines[i];
                    String amtText = lineText.Substring(lineText.IndexOf(totalAmountText)).Substring(totalAmountText.Length);
                    return Decimal.Parse(amtText);
                }
            }
            return 0;
        }
        private List<TempOrderDetails> getDetailsList(string[] lines, int prodCount)
        {
            List<TempOrderDetails> orderDetailsList = new List<TempOrderDetails>();
            int productStartsRow = getProductsFirstRowIndex(lines);
            int productsParsed = 0;
            while (productsParsed <productCount)
            {
                string orderNumber;
                string sku;
                string prodName;
                string qty;
                string price;
                string remarks;
                string amount;
                string storeCode;
                string prodFirstRow = lines[productStartsRow];
                if (prodFirstRow.Equals(pageFooterText))
                {
                    productStartsRow += 5;
                    continue;
                }
                string[] prodFirstRowArray = prodFirstRow.Split(' ');
                //qty = prodFirstRowArray[2];
                price = prodFirstRowArray[5];
                sku = prodFirstRowArray[1];
                string prodSecondRow = lines[productStartsRow+1];
                //sku = prodSecondRow.Substring(prodSecondRow.IndexOf("NTUC Stock Code :")+17);
                int prodNameEndIndex = prodSecondRow.Substring(0, prodSecondRow.IndexOf("NTUC Stock Code")).LastIndexOf(" ");

                string prodThirdRow = lines[productStartsRow + 3];
                storeCode = prodThirdRow.Split(' ')[0];
                prodName = prodSecondRow.Substring(0,prodNameEndIndex);
                remarks = lines[productStartsRow + 3] + " " + lines[productStartsRow + 4];

                string prodSixthRow = lines[productStartsRow + 5];
                qty = prodSixthRow.Split(' ')[0];
                amount = prodSixthRow.Split(' ')[1];
                orderNumber = lines[1].Substring(16);
                productStartsRow = productStartsRow + 6;
                

                TempOrderDetails orderDetails = new TempOrderDetails();
                orderDetails.Quantity = Decimal.Parse(qty);
                orderDetails.Price = Decimal.Parse(price);
                orderDetails.ProductId = sku;
                orderDetails.ProductName = prodName;
                orderDetails.Remarks = remarks;
                orderDetails.OrderNumber = orderNumber;
                orderDetails.Amount = Decimal.Parse(amount);
                orderDetails.StoreId = storeCode;
                orderDetailsList.Add(orderDetails);
                productsParsed++;
            }

            return orderDetailsList;
        }


        private List<TempOrderDetails> getOrderDetailsList(string[] itemRows, string[] allRows)
        {
            List<TempOrderDetails> orderDetailsList = new List<TempOrderDetails>();
            for (int i = 0; i < itemRows.Length; i++)
            {
                TempOrderDetails orderDetails = new TempOrderDetails();
                string itemRow = itemRows[i];
                int skuStartIndex = itemRow.IndexOf(".") + 5;
                int skuEndIndex = itemRow.IndexOf(" ", skuStartIndex);
                string prodId = itemRow.Substring(skuStartIndex, skuEndIndex - skuStartIndex);

                int productNameStartIndex = skuEndIndex + 1;
                int productNameEndIndex = itemRow.IndexOf("   ");
                string prodName = itemRow.Substring(productNameStartIndex, productNameEndIndex - productNameStartIndex);

                int qtyStartIndex = productNameEndIndex + 3;
                int qtyEndIndex = qtyStartIndex + 1;
                string qty = itemRow.Substring(qtyStartIndex, qtyEndIndex - qtyStartIndex);

                int priceStartIndex = itemRow.Substring(0, itemRow.LastIndexOf(" ")).LastIndexOf(" ") + 1;
                int priceEndIndex = itemRow.Substring(priceStartIndex).IndexOf(" ") + priceStartIndex;
                string price = itemRow.Substring(priceStartIndex, priceEndIndex - priceStartIndex);

                string address = getAddress(allRows);

                orderDetails.OrderNumber = tempOrder.OrderId;
                orderDetails.ProductId = prodId;
                orderDetails.ProductName = prodName;
                orderDetails.Quantity = decimal.Parse(qty);
                orderDetails.Price = decimal.Parse(price);
                orderDetails.Remarks = address;
                orderDetailsList.Add(orderDetails);
            }
            return orderDetailsList;
        }
        private string[] reArrangeItemRows(string[] allLines, int prodCount)
        {
            if (allLines.Length == prodCount)
            {
                return allLines;
            }
            string[] lines = new string[prodCount];
            int newIndex = 0;
            string line = "";
            for (int i = 0; i < allLines.Length; i++)
            {
                line = allLines[i];
                if (line.TrimStart().StartsWith((i + 1).ToString()))
                {
                    lines[newIndex++] = line;
                }
                else
                {
                    string repeatedLine = lines[newIndex - 1];
                    repeatedLine += line;
                    lines[newIndex - 1] = repeatedLine;
                }

            }
            return lines;
        }
        private int getProductsLastRowIndex(string[] lines)
        {
            int index = 0; //products area starts at 35
            while (!lines[index].Equals("Total No. of Products Ordered"))
            {
                index++;
            }
            return index;
        }
        private int getProductsFirstRowIndex(string[] lines)
        {
            for (int i = 0; i < lines.Length; i++)
            {
                if (lines[i].StartsWith("Delivery Date To"))
                {
                    return i + 1;
                }
            }

            return 0;
        }
        private string getDeliveryDate(string[] lines)
        {
            for (int i = 0; i < lines.Length; i++)
            {
                if (lines[i].Equals("Total No. of Products Ordered"))
                {
                    return lines[i - productRowsCount - 1];
                }
            }

            return null;
        }
        private string getAddress(string[] lines)
        {
            StringBuilder str = new StringBuilder();
            str.Append(lines[24]);
            str.Append(", " + lines[25]);
            str.Append(", " + lines[26]);

            return str.ToString();
        }
    }
}
