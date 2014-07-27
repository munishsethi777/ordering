using System;
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

namespace SatinLibs
{
    public class CustId751Parser : ParserI
    {

        public System.Data.DataSet getDataSet(string customerId, string fileLocation)
        {
            string pdfText = getTextFromPDF(fileLocation);
            DataSet storesDataSet = CustomerUtils.getStores(customerId);
            string[] lines = pdfText.Split(new string[] { "\r\n" }, StringSplitOptions.None);
            string supplierId = lines[5].Replace("Supplier : ", "");
            string orderNo = lines[11].Replace(":", ""); ;
            string orderDate = lines[15];
            string deliveryDate = lines[34];
            string storeCode = lines[5].Replace("Supplier : ", "");
            string orderAmount = lines[52].Trim();
            int storesCount = storesDataSet.Tables[0].Rows.Count;

            int totalProducts = int.Parse(lines[51]);
            string[] productIdArray = new string[totalProducts];
            string[] priceArray = new string[totalProducts];
            string[] productNameArray = new string[totalProducts];
            string[] qtyArray = new string[totalProducts];
            int proLineIndex = 35;
            for (int i = 0; i < totalProducts; i++)
            {
                string itemRow = lines[proLineIndex++];
                int skuStartIndex = itemRow.IndexOf(".") + 5;
                int skuEndIndex = itemRow.IndexOf(" ", skuStartIndex);
                productIdArray[i] = itemRow.Substring(skuStartIndex, skuEndIndex - skuStartIndex);

                int productNameStartIndex = skuEndIndex + 1;
                int productNameEndIndex = itemRow.IndexOf("   ");
                productNameArray[i] = itemRow.Substring(productNameStartIndex, productNameEndIndex - productNameStartIndex);

                int qtyStartIndex = productNameEndIndex + 3;
                int qtyEndIndex = qtyStartIndex + 1;
                qtyArray[i] = itemRow.Substring(qtyStartIndex, qtyEndIndex - qtyStartIndex);

                int priceStartIndex = itemRow.Substring(0, itemRow.LastIndexOf(" ")).LastIndexOf(" ") + 1;
                int priceEndIndex = itemRow.Substring(priceStartIndex).IndexOf(" ") + priceStartIndex;
                priceArray[i] = itemRow.Substring(priceStartIndex, priceEndIndex - priceStartIndex);

            }
            TempOrder tempOrder = new TempOrder();
            tempOrder.Seq = 0;
            tempOrder.OrderId = orderNo;
            tempOrder.OrderDate = DateTime.Parse(orderDate);
            tempOrder.CreatedOn = new DateTime();
            tempOrder.CustomerId = supplierId;
            tempOrder.DeliveryDate = DateTime.Parse(deliveryDate);
            tempOrder.Amount = decimal.Parse(orderAmount);

            List<TempOrderDetails> orderDetailList = new List<TempOrderDetails>();
            for (int i = 0; i < totalProducts; i++)
            {
                TempOrderDetails orderDetails = new TempOrderDetails();
                string priceStr = priceArray[i];
                orderDetails.Price = decimal.Parse(priceStr);
                orderDetails.ProductId = productIdArray[i];
                string qntyStr = priceArray[i];
                orderDetails.Quantity = decimal.Parse(qntyStr);
                orderDetails.ProductName = productNameArray[i];
                orderDetailList.Add(orderDetails);
            }
            tempOrder.OrderDetails = orderDetailList;
            DataSetUtils utils = new DataSetUtils();
            DataSet mainDs = utils.ToDataSet(tempOrder);
            DataTable dt = getCommonDataTable(totalProducts, storesDataSet);
            DataSet ds = new DataSet();
            for (int i = 0; i < totalProducts; i++)
            {
                DataRow row = mainDs.Tables[0].Rows[i];
                string itemNo = row.ItemArray[3].ToString();
                string itemName = row.ItemArray[4].ToString();
                string price = row.ItemArray[5].ToString();
                object[] array = new object[storesCount + 4];
                if (storesCount == 0)
                {
                    array = new object[1 + 4];
                }


                array[0] = itemNo;
                array[1] = itemName;
                array[2] = price;


                int rowCounter = 3;
                if (storesCount == 0)
                {
                    //store value will be come from pdf file.By the time given static value for testing.
                    array[rowCounter++] = "20";
                }
                else
                {
                    for (int j = 0; j < storesCount; j++)
                    {
                        array[rowCounter++] = "20";
                    }
                }


                string remarks = "";
                array[rowCounter] = remarks;
                dt.Rows.Add(array);
            }
            ds.Tables.Add(dt);
            return ds;
        }

        public DataTable getCommonDataTable(int totalRowsCount, DataSet storesDataSet)
        {
            DataTable mytable = new DataTable();
            mytable.Columns.Add("Sl#");
            mytable.Columns.Add("Product");
            mytable.Columns.Add("Price");
            int storesCount = storesDataSet.Tables[0].Rows.Count;

            if (storesCount > 0)
            {
                for (int i = 0; i < storesCount; i++)
                {
                    mytable.Columns.Add(storesDataSet.Tables[0].Rows[i].ItemArray[0].ToString());
                }
            }
            else
            {
                mytable.Columns.Add("Delivery");
            }
            mytable.Columns.Add("Remarks");
            return mytable;
        }
        private string getTextFromPDF(String fileLocation)
        {
            PDDocument doc = PDDocument.load(fileLocation);
            PDFTextStripper stripper = new PDFTextStripper();
            String txt = stripper.getText(doc);
            return txt;
        }
    }
}
