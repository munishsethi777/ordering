using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Data;
using MVCADOService;
using MVCEF.Infrastructure;
using MVCDataModel;
using System.Web;
using MvcJqGrid;
using System.Net;
using System.IO;
namespace SatinLibs
{
   public class SatInHomeRepository
    {
       static log4net.ILog log = log4net.LogManager.GetLogger("SatInHomeRepository");
        
       private MVCEFEntities objContext = new MVCEFEntities();
       public string InsertOrder()
       {
           {
               try
               {
                   OrderingSystem.ServiceReference1.ServiceSoapClient objService = new OrderingSystem.ServiceReference1.ServiceSoapClient("ServiceSoap1");
                   OrderingSystem.ServiceReference1.InsertOrderRequest list = new OrderingSystem.ServiceReference1.InsertOrderRequest();
                   string sOrderNumbers = "";
                   MVCEFEntities objContext = new MVCEFEntities();
                   DataSet dsOrder = objContext.ExecuteDataSet("select * from tblorder where orderstatusid='1' and cast(cutofftime as time) < cast(getdate() as time)");
                   OrderingSystem.ServiceReference1.InsertOrderResponse resp = null;

                   
                   if (dsOrder != null && dsOrder.Tables.Count > 0 && dsOrder.Tables[0].Rows.Count > 0)
                   {
                       foreach (DataRow row in dsOrder.Tables[0].Rows)
                       {

                           string sOrderId = row["OrderId"].ToString();
                           string sOrderNumber = row["OrderNumber"].ToString();
                           string invoiceOrderNumber = row["InvoiceOrderNo"].ToString();
                           string sOrderAmt = row["TotalAmount"].ToString();
                           int CustomerId = (int)row["CustomerId"];
                           string remarks = row["Remarks"].ToString();
                           DataSet dsOrderDetail = objContext.ExecuteDataSet(
                                string.Format("select tblOrderDetail.*, tblStore.*, tblProduct.productName,tblProduct.skuid"
                                    + " from tblOrderDetail, tblStore, tblProduct" 
                                    + " where tblOrderDetail.orderId = "+ sOrderId
                                    + " and tblOrderDetail.storeId = tblStore.storeId"
                                    + " and tblOrderDetail.productid = tblProduct.productid"));
                            if (dsOrderDetail != null && dsOrderDetail.Tables.Count > 0)
                            {
                                list = new OrderingSystem.ServiceReference1.InsertOrderRequest();
                                list.dDiscount = 0;
                                list.dDiscountPer = 0;
                                list.sAgentId = "111";
                                list.dtVoidDate = DateTime.Now;
                                list.bVoid = 0;
                                list.sMDTNo = "MQ";
                                list.sConditionMaster = "";
                                list.sConditionType = "";
                                list.sConditionValue = "";
                                
                                string sStoreCode = dsOrderDetail.Tables[0].Rows[0]["InternalStoreCode"].ToString();
                                list.sOrdNo = sOrderNumber;
                                list.dtOrdDate = DateTime.Now;
                                list.dtDeliDate = DateTime.Now;
                                list.sCustNo = sStoreCode;
                                list.sPoNo = invoiceOrderNumber;
                                list.sRemarks = remarks;

                                string arrayPromoID = "";
                                string arrayPromoOffer = "";
                                string arrayDisPer = "";
                                string arrayDisPr = "";
                                string itemNos="";
                                string uoms = "";
                                string qtys = "";
                                string prices = "";
                                string itemNames = "";
                                string subAmounts = "";
                                string lineNos = "";
                                int lineNo = 0;
                                foreach (DataRow rowOrder in dsOrderDetail.Tables[0].Rows)
                                {
                                    lineNo++;
                                    double price = double.Parse(rowOrder["Price"].ToString());
                                    double qty = double.Parse(rowOrder["Quantity"].ToString()); ;
                                    if (itemNos != "")
                                    {
                                        itemNos += ","+rowOrder["skuid"].ToString();
                                        uoms += "," + rowOrder["uom"].ToString();
                                        qtys += "," + qty.ToString();
                                        prices += "," + price.ToString();
                                        itemNames += "," + rowOrder["productName"].ToString();
                                        subAmounts += "," + rowOrder["amount"].ToString();
                                        lineNos += "," + lineNo;
                                        arrayPromoID += "," + 0;
                                        arrayPromoOffer += "," + 0;
                                        arrayDisPer += "," + 0;
                                        arrayDisPr += "," + 0;
                                    }
                                    else
                                    {
                                        itemNos += rowOrder["skuid"].ToString();
                                        uoms += rowOrder["uom"].ToString();
                                        qtys += qty.ToString();
                                        prices += price.ToString();
                                        itemNames += rowOrder["productName"].ToString();
                                        subAmounts += rowOrder["amount"].ToString(); ;
                                        lineNos += lineNo;
                                        arrayPromoID +=  0;
                                        arrayPromoOffer +=  0;
                                        arrayDisPer +=  0;
                                        arrayDisPr +=  0;
                                    }
                                }

                                list.arrayPromoID = "[" + arrayPromoID + "]";
                                list.arrayPromoOffer = "[" + arrayPromoOffer + "]";
                                list.arrayDisPer = "[" + arrayDisPer + "]";
                                list.arrayDisPr = "[" + arrayDisPr + "]";

                                list.arrayItemNo = "[" + itemNos + "]";
                                list.arrayUOM = "[" + uoms + "]";
                                list.arrayQty = "[" + qtys + "]";
                                list.arrayPrice = "[" + prices + "]";
                                list.arrayItemName = "[" + itemNames + "]";
                                list.arraySubAmt = "[" + subAmounts + "]";
                                list.arrLineNo = "[" + lineNos + "]"; ;
                                resp = objService.InsertOrder(list);
                            }
                          

                           sOrderNumbers = sOrderNumbers + resp.InsertOrderResult + ",";
                           objContext.ExecuteQuery(string.Format(" update tblorder set orderstatusid = 2 where orderid= {0}  ", sOrderId));
                           log.Info("Order uploaded with orderId :" + sOrderNumbers);

                       }
                   }
                   else
                   {
                       log.Info("No Pending orders to upload");
                   }
                   return "";
               }
               catch (Exception Ex)
               {
                   log.Error("Error Occured while order submission",Ex);
                   return Ex.Message;
               }
           
       }

       private string InsertCallPost()
       {
           string postData = getPostURL();
           //HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://54.251.247.189/standardwebservice/service.asmx/InsertOrder");
           string getUrl = "http://54.251.247.189/standardwebservice/service.asmx/InsertOrder";
           //string postData = String.Format("email={0}&pass={1}", "value1", "value2");
           HttpWebRequest getRequest = (HttpWebRequest)WebRequest.Create(getUrl);
           //getRequest.CookieContainer = new CookieContainer();
           ///getRequest.CookieContainer.Add(cookies); //recover cookies First request
           getRequest.Method = WebRequestMethods.Http.Post;
           getRequest.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.874.121 Safari/535.2";
           getRequest.AllowWriteStreamBuffering = true;
           getRequest.ProtocolVersion = HttpVersion.Version11;
           getRequest.AllowAutoRedirect = true;
           getRequest.ContentType = "application/x-www-form-urlencoded";

           byte[] byteArray = Encoding.ASCII.GetBytes(postData);
           getRequest.ContentLength = byteArray.Length;
           Stream newStream = getRequest.GetRequestStream(); //open connection
           newStream.Write(byteArray, 0, byteArray.Length); // Send the data.
           newStream.Close();

           HttpWebResponse getResponse = (HttpWebResponse)getRequest.GetResponse();
           string sourceCode;
           using (StreamReader sr = new StreamReader(getResponse.GetResponseStream()))
           {
               sourceCode = sr.ReadToEnd();
           }
           return sourceCode;
       }
       private string getPostURL()
       {
           string str = "sOrdNo=OP-20140805-230393&dtOrdDate=2014-08-06 12:54:33&dtDeliDate=2014-08-06 12:54:33&sCustNo=230393&sPoNo=B052426&dDiscount=0&dDiscountPer=0&sAgentId=111&dtVoidDate=2014-08-08 15:08:49&bVoid=0&sRemarks=test&arrayItemNo={'082I93B20012P02001'}&arrayUOM={1}&arrayQty={4}&arrayPrice={3.59}&sMDTNo=MQ&arrayItemName={'CP SHRIMP WONTON SESAME 204GM'}&arrayPromoID={'0'}&arrayPromoOffer={'0'}&arrayDisPer={'0'}&arrayDisPr={'0'}&arraySubAmt={7}&arrLineNo={1}&sConditionMaster=&sConditionType=&sConditionValue=";

           return str;
       }

       public Dictionary<string, string> SaveUploadedOrders(string total, string orderby, string phone, string remarks, string data, string header, string customerId)
        {

            try
            {
                Newtonsoft.Json.Linq.JArray jData = JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JArray>(data);
                Newtonsoft.Json.Linq.JArray jHeader = JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JArray>(header);
                DataTable dtResult = new DataTable("Order");
                foreach (var item in jHeader)
                {
                    dtResult.Columns.Add(item.ToString());
                }
                string name = "";
                foreach (var row in jData)
                {
                    DataRow dr = dtResult.NewRow();
                    for (int i = 0; i < dtResult.Columns.Count; i++)
                    {
                        if (row[i].ToString() == "")
                            dr[i] = "0";
                        else
                            dr[i] = row[i].ToString();

                        name = jHeader[i].ToString();      
                    }
                    dtResult.Rows.Add(dr);
                }
              return SaveOrders(total, orderby, phone, remarks, dtResult, customerId);
              }
            catch (Exception Ex)
            {

            }
            return null; 
        }
       public Dictionary<string, string> SaveOrders(string total, string orderby, string phone, string remarks, DataTable orderDetail, string customerIdStr)
       {
           Dictionary<string, string> errorMap = new Dictionary<string, string>();
           try
           {
               SiteSession session = (SiteSession)HttpContext.Current.Session["SiteSession"];              
               int userId = session.UserId;
               int customerId = int.Parse(customerIdStr);
               object dsResult = null;
               String customerCode = CustomerUtils.getCustomerCode(customerId);
               string sSql = "";
               int orderId =0;
               DataRow firstRow = orderDetail.Rows[0];
               String orderNo = firstRow[0].ToString();
               if (!string.IsNullOrEmpty(total))
               {
                   total = total.Replace("$", "").Trim();
               }
               //getting order DataSet if already exist
               DataTable order = getOrderSeqByInvoiceOrderNo(orderNo);
               if (order.Rows.Count > 0)
               {
                   DataRow orderRow = order.Rows[0];
                   string orderIdStr = orderRow.ItemArray[0].ToString();
                   if (orderRow.ItemArray[0].ToString() != null) ;
                   {
                       orderId = int.Parse(orderIdStr);
                   }
               }
               
               errorMap = ValidatorUtil.validateSaveOrders(order,orderDetail, customerCode);
               if (errorMap.Keys.Count == 0)
               {
                  //Deleting orderDetail if already exist with orderId.
                   Boolean  isDeleted = DeleteOrderDetailByOrder(orderId);
                   if (isDeleted)
                   {
                       errorMap.Add("UPDATED", "Order Detail is updated successfully for orderNo :- " + orderNo);
                   }
                   Dictionary<String, ProductCustomer> map = getCustomerProductMap(customerCode);
                   if (orderId ==0) {
                       sSql = string.Format("exec satIn_spSaveOrders @invoiceorderno = '{0}' , @customerid = {1}, @userid = {2}", orderNo, customerId, userId);
                       orderId = Convert.ToInt16(objContext.ExecuteObject(sSql));
                   }
                   decimal orderTotalAmount = 0;
                   foreach (DataRow row in orderDetail.Rows)
                   {
                       if (row[0] != null && row[0].ToString() != "0" && !string.IsNullOrEmpty(row[0].ToString()))
                       {

                           String ext_ItemId = row[1].ToString();
                           if (map.Keys.Contains(ext_ItemId))
                           {
                               ProductCustomer productCust = map[ext_ItemId];
                               decimal price = decimal.Parse(row[3].ToString());
                               int qnty = int.Parse(row[4].ToString());
                               decimal amount = price * qnty;
                               qnty = productCust.UOMultipler * qnty;
                               String skuId = productCust.ItemId;
                               sSql = string.Format(@"insert into tblorderdetail(orderid, storeid, productid, price, quantity, amount, remarks, remarks2, uom)
                            select {0}, storeid, productid,{1}, {2} , {3}, '{4}', '{5}', {6} from tblproduct p, tblstore s where skuid='{7}' and storecode='{8}' ",
                                           orderId, row[3], qnty, amount, row[orderDetail.Columns.Count - 1], "", productCust.UOMultipler, skuId, orderDetail.Columns[4].ColumnName);
                               dsResult = objContext.ExecuteQuery(sSql);
                               orderTotalAmount += amount;
                           }

                       }
                   }
                   //update order details
                   sSql = string.Format(@"update tblorder set totalamount = {0}, orderedby = '{1}', contactno = '{2}', 
                                    lastchangeduser = {3}, lastchangeddate = getdate() where orderid = {4} ",
                                       orderTotalAmount, orderby, phone, session.UserId, orderId);
                   dsResult = objContext.ExecuteQuery(sSql);

               }
           }
           catch (Exception Ex)
           {
               errorMap.Add("Exception","Message: " + Ex.Message + "</br>InnerException: " + Ex.InnerException  + "</br>StackTrace: " + Ex.StackTrace);               
           }
           errorMap.OrderBy(key => key.Value);
           return errorMap;
       }

       private Boolean DeleteOrderDetailByOrder(int orderSeq)
       {
           string sSql = string.Format("delete from tblorderdetail where orderid = '{0}'", orderSeq);
           int result = objContext.ExecuteQuery(sSql);
           return result > 0; ;
       }

       private DataTable getOrderSeqByInvoiceOrderNo(string orderNumber)
       {
           string sSql = string.Format("select orderid,OrderStatusId,invoiceorderno from  tblOrder where invoiceorderno = '{0}'", orderNumber);
           DataSet orderDataSet = objContext.ExecuteDataSet(sSql);
           DataTable orderDataTable = orderDataSet.Tables[0];
           return orderDataTable; 
       }

       public Dictionary<String,ProductCustomer> getCustomerProductMap(string customerNo)
       {
            string sSql = string.Format("select * from  tblProductCustomerMap where customerid = '{0}'", customerNo);
            DataSet customerDataSet = objContext.ExecuteDataSet(sSql);
            int totalCustomers = customerDataSet.Tables[0].Rows.Count;
            Dictionary<String, ProductCustomer> map = new Dictionary<String, ProductCustomer>();
            for (int i = 0; i < totalCustomers; i++)
            {
                DataRow row = customerDataSet.Tables[0].Rows[i];
                ProductCustomer productCustomer = new ProductCustomer();
                productCustomer.ItemId = row.ItemArray[1].ToString();
                productCustomer.CustomerNo = row.ItemArray[2].ToString();
                productCustomer.UOMultipler = int.Parse(row.ItemArray[3].ToString());
                productCustomer.Ext_ItemId = row.ItemArray[4].ToString();
                productCustomer.orderCuttOff = int.Parse(row.ItemArray[5].ToString());
                
                map.Add(productCustomer.Ext_ItemId, productCustomer);
            }
            return map;

            //call productCustomerMap table to fetch all information of the given customer;
            //you can find the storesProcedure for this.

            //insert itemId value from map table providing ext_itemId
            // insert qty into table by multiplying qty already to uommultiplier
        }

       public object GridDataOrderDashboard(GridSettings objGrdSettings)
       {
           try
           {
               DataSet objOrderDashboard = GetOrderDashboardList(objGrdSettings);
               Int64 objTot = Convert.ToInt64(objOrderDashboard.Tables[1].Rows[0]["Cnt"]);

               if (objOrderDashboard == null)
                   return null;

               var jsonData = new
               {
                   total = objTot / objGrdSettings.PageSize + 1,
                   page = objGrdSettings.PageIndex,
                   records = objTot,
                   rows = (
                       from c in objOrderDashboard.Tables[0].AsEnumerable()
                       select new
                       {
                           id = c["orderid"],
                           cell = new object[] 
                                { 
                                    c["orderid"], // first primary key
                                    c["isdisabled"],
                                    c["customername"],
                                    c["ordereddate"].ToPSEDate(),
                                    c["orderstatus"],
                                    c["cutofftime"],
                                    "$ " + c["totalamount"].ToPSEDecimal(),
                                    c["username"],
                                    c["createddate"].ToPSEDate(),
                                    c["lastchangeddate"].ToPSEDate(),
                                    c["lastchangeduser"]
                                }
                       }).ToArray()
               };
               return jsonData;
           }
           catch (Exception Ex)
           {
           }

           return null;
       }

       private DataSet GetOrderDashboardList(GridSettings objGrdSettings)
        {
            try
            {

                //sp param
                string sParam = "";
               // sParam += string.Format("@CustomerID = {0}", session.CustomerId);

                // for paging
                if (objGrdSettings.PageSize > 0)
                {
                    sParam += string.Format("@startindex = {0}, @endindex = {1}", ((objGrdSettings.PageIndex - 1) * objGrdSettings.PageSize) + 1, (objGrdSettings.PageIndex * objGrdSettings.PageSize));
                }

                //for search
                string sSearchString = "";
                if (objGrdSettings.Where != null)
                {
                    foreach (var item in objGrdSettings.Where.rules)
                    {
                        if (item.field.Contains("date"))
                            sSearchString += string.Format(" and convert(varchar, {0}, 101) like ''{1}%'' ", item.field, item.data);
                        else
                            sSearchString += string.Format(" and CONVERT(VARCHAR, ISNULL({0},0)) like ''{1}%'' ", item.field, item.data);
                    }
                    sParam += string.Format(", @SearchBy = ' {0}'", sSearchString);
                }

                //for sorting
                string sOrderBy = "";
                if (!string.IsNullOrEmpty(objGrdSettings.SortColumn))
                {
                    if(objGrdSettings.SortColumn.Contains("date"))
                        sOrderBy += string.Format(" {0} {1} ", objGrdSettings.SortColumn, objGrdSettings.SortOrder);
                    else
                        sOrderBy += string.Format(" CONVERT(VARCHAR, ISNULL({0},0)) {1} ", objGrdSettings.SortColumn, objGrdSettings.SortOrder);

                    sParam += string.Format(", @OrderBy = ' {0}'", sOrderBy);
                }


                //sql query result
                DataSet dsResult = null;
                string sSql = string.Format("EXEC satIn_spGetOrders {0}", sParam);
                dsResult = objContext.ExecuteDataSet(sSql);
               // session.SqlQuery = sSql;
                return dsResult;
            }
            catch (Exception Ex)
            {
                return null;
            }

        }

    }

    
}
