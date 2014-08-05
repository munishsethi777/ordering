using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.IO;

namespace SatinLibs
{
    public class CustId722Parser : ParserI

    {
        private int customerId;
        public DataSet getDataSet(string _customerId, string fileLocation)
        {
            DataSet dt = new DataSet();
            customerId = int.Parse(_customerId);
            string[] allLines = getText(fileLocation);
            Dictionary<string, TempOrder> orderMap = getOrderMap(allLines);
            foreach (KeyValuePair<string, TempOrder> orders in orderMap)
            {
                fillDataSet(orders.Key,orders.Value, dt);
            }
            return dt;
        }

        private Dictionary<string, TempOrder> getOrderMap(string[] allLines)
        {
            Dictionary<string, TempOrder> ordersDirectory = new Dictionary<string, TempOrder>();

            foreach (string line in allLines.Skip(1))
            {
                char[] delimiterChars = { ',' };
                string[] columns = line.Split(delimiterChars);
                string date = columns[0];
                string storeCode = columns[1];
                string remarks = "Vehicle No. : " + "[" + storeCode + "]";
                TempOrder order = null;
                if (ordersDirectory.ContainsKey(storeCode))
                {
                    order = ordersDirectory[storeCode];
                    order.OrderDetails.Add(getOrderDetails(columns));
                }
                else
                {
                    order = new TempOrder();
                    order.Seq = 0;
                    order.OrderId = "#Test";
                    //tempOrder.OrderDate = DateTime.Parse(orderDate);
                    order.CreatedOn = new DateTime();
                    //tempOrder.CustomerId = supplierId;
                   
                    order.Remarks = remarks;
                    //tempOrder.DeliveryDate = DateTime.Parse(deliveryDate);
                    //tempOrder.Amount = getTotalAmount(lines);
                    order.OrderDetails = new List<TempOrderDetails>();
                    order.OrderDetails.Add(getOrderDetails(columns));
                    ordersDirectory.Add(storeCode, order);
                }
              }
            return ordersDirectory;
        }


        private void fillDataSet(string storecode,TempOrder order,DataSet dataSet)
        {
            DataSetUtils utils = new DataSetUtils();
            DataSet mainDs = utils.ToDataSet(order);
            int productCount = order.OrderDetails.Count;
            DataTable dt = null;
            dt = getCommonDataTable(storecode);
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
        private string[] getText(String fileLocation)
        {
            string[] allLines = File.ReadAllLines(fileLocation);
            return allLines;
        }

        private TempOrderDetails getOrderDetails(string[] columns)
        {
            TempOrderDetails orderDetails = new TempOrderDetails();
            string productId = columns[2];
            string itemName = columns[3];
            string storeCode = columns[1];
            string remarks = "Vehicle No. : " + "[" + storeCode + "]";
            int UOM = 1;
            int qty = 0;
            foreach (string column in columns.Skip(4))
            {
                if (!column.Equals(IConstants.BLANK))
                {
                    qty = qty + int.Parse(column);
                }
            }


            orderDetails.OrderNumber = "OP-" + columns[0] + "-SCM-9999-00001-" + storeCode;
            orderDetails.ProductId = productId;
           
            itemName =  System.Web.HttpUtility.JavaScriptStringEncode(itemName);
            orderDetails.ProductName = itemName;
            orderDetails.Quantity = qty;
           
            //orderDetails.Price = decimal.Parse(price);
            orderDetails.Remarks = remarks;
            return orderDetails;
        }
       
        public DataTable getCommonDataTable(String storeCode)
        {
            DataTable mytable = new DataTable();
            mytable.Columns.Add("Order#");
            mytable.Columns.Add("Sl#");
            mytable.Columns.Add("Product");
            mytable.Columns.Add("Price");
            mytable.Columns.Add(" " + storeCode);
            mytable.Columns.Add("Remarks");
            return mytable;
        }
    }
}
