using System;
using System.Collections.Generic;
using System.Linq;


namespace OrderingSystem
{


    public class ParsePDF{
        public static void parse()
        {
            string[] lines = System.IO.File.ReadAllLines(@"G:\PO.txt");
            string customerId = lines[5].Replace("Supplier : ","");
            string orderNo = lines[11].Replace(":", ""); ;
            string orderDate = lines[15];
            string deliveryDate = lines[34];
            string storeCode = lines[5].Replace("Supplier : ", "");
            string orderAmount = lines[52].Trim();
            string remarks = "";
            string skuid = "";
            string price = "";
            string productName = "";
            
            int totalProducts = int.Parse(lines[51]);
            string[] skuIdArray = new string[totalProducts];
            string[] priceArray = new string[totalProducts];
            string[] productNameArray = new string[totalProducts];
            string[] qtyArray = new string[totalProducts];
            int proLineIndex = 35;
            for (int i = 0; i < totalProducts; i++){
                string itemRow = lines[proLineIndex++];
                int skuStartIndex = itemRow.IndexOf(".") + 5;
                int skuEndIndex = itemRow.IndexOf(" ",skuStartIndex);
                skuIdArray[i] = itemRow.Substring(skuStartIndex, skuEndIndex - skuStartIndex);

                int productNameStartIndex = skuEndIndex + 1;
                int productNameEndIndex = itemRow.IndexOf("   ");
                productNameArray[i] = itemRow.Substring(productNameStartIndex, productNameEndIndex - productNameStartIndex);

                int qtyStartIndex = productNameEndIndex + 3;
                int qtyEndIndex = qtyStartIndex + 1;
                qtyArray[i] = itemRow.Substring(qtyStartIndex, qtyEndIndex - qtyStartIndex);

                int priceStartIndex = itemRow.Substring(0, itemRow.LastIndexOf(" ")).LastIndexOf(" ")+1;
                int priceEndIndex = itemRow.Substring(priceStartIndex).IndexOf(" ") + priceStartIndex;
                priceArray[i] = itemRow.Substring(priceStartIndex, priceEndIndex - priceStartIndex);
                //int priceEndIndex = itemRow.IndexOf(" ", priceStartIndex);
                //qtyArray[i] = itemRow.Substring(priceStartIndex, priceEndIndex - priceStartIndex);

            }
            OrderingSystem.ServiceReference1.InsertOrderRequest insertOrderRequest = new OrderingSystem.ServiceReference1.InsertOrderRequest();
            insertOrderRequest.sOrdNo = orderNo;
            insertOrderRequest.dtOrdDate = Convert.ToDateTime(orderDate);
            insertOrderRequest.dtDeliDate = Convert.ToDateTime(deliveryDate).AddDays(1);
            insertOrderRequest.sCustNo = storeCode;
            insertOrderRequest.sPoNo = "PO_Test";
            insertOrderRequest.dDiscount = 0;
            insertOrderRequest.dDiscountPer = 0;
            insertOrderRequest.sAgentId = "";
            insertOrderRequest.dtVoidDate = DateTime.Now;
            insertOrderRequest.bVoid = 0;
            insertOrderRequest.sRemarks = remarks;
            insertOrderRequest.arrayItemNo = skuid;
            insertOrderRequest.arrayUOM = "";
            insertOrderRequest.arrayQty ="sd";
            insertOrderRequest.arrayPrice = price;
            insertOrderRequest.sMDTNo = "mq";
            insertOrderRequest.arrayItemName =productName;

            insertOrderRequest.arrayPromoID = "0";
            insertOrderRequest.arrayPromoOffer = "0";
            insertOrderRequest.arrayDisPer = "0";
            insertOrderRequest.arrayDisPr = "0";
            insertOrderRequest.arraySubAmt = orderAmount;
            insertOrderRequest.arrLineNo = "0";

            insertOrderRequest.sConditionMaster = "0";
            insertOrderRequest.sConditionType = "0";
            insertOrderRequest.sConditionValue = "0";
        }

    }
}
