using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using MVCEF.Infrastructure;
using System.Data;
using Newtonsoft.Json;
using MVCADOService;

namespace OrderingSystem
{
    /// <summary>
    /// Summary description for OrderingService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class OrderingService : System.Web.Services.WebService
    {

        [WebMethod(EnableSession = true)]
        public string MergeProduct()
        {
            try
            {
                ServiceReference1.ServiceSoapClient objService = new ServiceReference1.ServiceSoapClient("ServiceSoap1");
                ServiceReference1.GetItemsListRequest list = new ServiceReference1.GetItemsListRequest();
                list.mdtNo = "mq";
                list.offset = 0;
                list.length = 1024;
                list.ts = 0;
                ServiceReference1.GetItemsListResponse resp = objService.GetItemsList(list);
                DataSet dataSet = JsonConvert.DeserializeObject<DataSet>(resp.GetItemsListResult);
                //spMergeProduct '<Items><Item><Itemid>082193B20012P012G1</Itemid><ItemName>Test</ItemName><Price>20.50</Price><Available>10</Available><Active>1</Active></Item></Items>'
                string sXml = "<Items>";
                /*
                & - &amp;
                < - &lt;
                > - &gt;
                " - &quot;
                ' - &#39;
                */
                string item = "", itemname = "", shortname = "", fullname = "";
                foreach (DataRow row in dataSet.Tables["Result"].Rows)
                {
                    item = row["Itemid"].ToString();
                    item = item.Replace("&", "&amp;");
                    item = item.Replace("<", "&lt;");
                    item = item.Replace(">", "&gt;");
                    item = item.Replace("\"", "&quot;");
                    item = item.Replace("'", "&#39;");

                    itemname = row["ItemName"].ToString();
                    itemname = itemname.Replace("&", "&amp;");
                    itemname = itemname.Replace("<", "&lt;");
                    itemname = itemname.Replace(">", "&gt;");
                    itemname = itemname.Replace("\"", "&quot;");
                    itemname = itemname.Replace("'", "&#39;");

                    shortname = row["ShortDesc"].ToString();
                    shortname = shortname.Replace("&", "&amp;");
                    shortname = shortname.Replace("<", "&lt;");
                    shortname = shortname.Replace(">", "&gt;");
                    shortname = shortname.Replace("\"", "&quot;");
                    shortname = shortname.Replace("'", "&#39;");

                    fullname = row["FullDesc"].ToString();
                    fullname = fullname.Replace("&", "&amp;");
                    fullname = fullname.Replace("<", "&lt;");
                    fullname = fullname.Replace(">", "&gt;");
                    fullname = fullname.Replace("\"", "&quot;");
                    fullname = fullname.Replace("'", "&#39;");

                    sXml = sXml + "<Item><Itemid>" + item + "</Itemid><ItemName>" + itemname + "</ItemName><ShortDesc>" + shortname + "</ShortDesc><FullDesc>" + fullname + "</FullDesc><Price>" + row["Price"] + "</Price><Available>" + row["Available"] + "</Available><Category>" + row["CategoryId"].ToString() + "</Category><Brand>" + row["Brand"].ToString() + "</Brand><Active>" + row["Active"] + "</Active></Item>";

                }
                sXml = sXml + "</Items>";
                MVCEFEntities objContext = new MVCEFEntities();
                object objResult = objContext.ExecuteObject(string.Format("exec spMergeProduct '{0}', {1}", sXml, Session["UserId"]));

                if (objResult != null && Convert.ToInt16(objResult) > 0)
                    return "Success";
            }
            catch (Exception Ex)
            {
                return Ex.Message;
            }
            return "Fail";
        }
        [WebMethod(EnableSession = true)]
        public string MergePrice()
        {
            try
            {
                ServiceReference1.ServiceSoapClient objService = new ServiceReference1.ServiceSoapClient("ServiceSoap1");
                ServiceReference1.GetItemPriceListRequest list = new ServiceReference1.GetItemPriceListRequest();
                list.mdtNo = "mq";
                list.offset = 0;
                list.length = 1024;
                list.ts = 0;
                ServiceReference1.GetItemPriceListResponse resp = objService.GetItemPriceList(list);
                DataSet dataSet = JsonConvert.DeserializeObject<DataSet>(resp.GetItemPriceListResult);
                //spMergeProduct '<Items><Item><Itemid>082193B20012P012G1</Itemid><ItemName>Test</ItemName><Price>20.50</Price><Available>10</Available><Active>1</Active></Item></Items>'
                string sXml = "<Prices>";
                /*
                & - &amp;
                < - &lt;
                > - &gt;
                " - &quot;
                ' - &#39;
                */
                string code = "", name = "";
                foreach (DataRow row in dataSet.Tables["Result"].Rows)
                {

                    name = row["ItemID"].ToString();
                    name = name.Replace("&", "&amp;");
                    name = name.Replace("<", "&lt;");
                    name = name.Replace(">", "&gt;");
                    name = name.Replace("\"", "&quot;");
                    name = name.Replace("'", "&#39;");

                    sXml = sXml + "<Price><ItemID>" + name + "</ItemID><UOM>" + row["UOM"].ToString() + "</UOM><UnitPrice>" + row["UnitPrice"].ToString() + "</UnitPrice><SalesType>" + row["SalesType"].ToString() + "</SalesType><ToDate>" + row["ToDate"].ToString() + "</ToDate><FromDate>" + row["FromDate"].ToString() + "</FromDate><MinQty>" + row["MinQty"].ToString() + "</MinQty></Price>";

                }
                sXml = sXml + "</Prices>";
                MVCEFEntities objContext = new MVCEFEntities();
                object objResult = objContext.ExecuteObject(string.Format("exec spMergePrice '{0}', {1} ", sXml, Session["UserId"]));

                if (objResult != null && Convert.ToInt16(objResult) > 0)
                    return "Success";
            }
            catch (Exception Ex)
            {
                return Ex.Message;
            }
            return "Fail";
        }
        
        [WebMethod(EnableSession=true)]
        public string MergeCustomer()
        {
            try
            {
                ServiceReference1.ServiceSoapClient objService = new ServiceReference1.ServiceSoapClient("ServiceSoap1");
                ServiceReference1.GetCustomersListRequest list = new ServiceReference1.GetCustomersListRequest();
                list.mdtNo = "mq";
                list.offset = 0;
                list.length = 1024;
                list.ts = 0;
                ServiceReference1.GetCustomersListResponse resp = objService.GetCustomersList(list);
                DataSet dataSet = JsonConvert.DeserializeObject<DataSet>(resp.GetCustomersListResult);
                //spMergeProduct '<Items><Item><Itemid>082193B20012P012G1</Itemid><ItemName>Test</ItemName><Price>20.50</Price><Available>10</Available><Active>1</Active></Item></Items>'
                string sXml = "<Customers>";
                /*
                & - &amp;
                < - &lt;
                > - &gt;
                " - &quot;
                ' - &#39;
                */
                string code = "", name = "";
                foreach (DataRow row in dataSet.Tables["Result"].Rows)
                {
                    code = row["CustNo"].ToString();
                    code = code.Replace("&", "&amp;");
                    code = code.Replace("<", "&lt;");
                    code = code.Replace(">", "&gt;");
                    code = code.Replace("\"", "&quot;");
                    code = code.Replace("'", "&#39;");

                    name = row["Customername"].ToString();
                    name = name.Replace("&", "&amp;");
                    name = name.Replace("<", "&lt;");
                    name = name.Replace(">", "&gt;");
                    name = name.Replace("\"", "&quot;");
                    name = name.Replace("'", "&#39;");

                    sXml = sXml + "<Customer><CustNo>" + code + "</CustNo><Customername>" + name + "</Customername><Contact>" + row["Contact"].ToString() + "</Contact><Phone>" + row["Phone"].ToString() + "</Phone><Email>" + row["Email"].ToString() + "</Email><AgentId>" + row["AgentID"].ToString() + "</AgentId><AccCustCode>" + row["AcCustCode"].ToString() + "</AccCustCode><Active>" + row["Active"] + "</Active></Customer>";

                }
                sXml = sXml + "</Customers>";
                MVCEFEntities objContext = new MVCEFEntities();
                object objResult = objContext.ExecuteObject(string.Format("exec spMergeCustomer '{0}', {1} ", sXml, Session["UserId"]));

                if (objResult != null && Convert.ToInt16(objResult) > 0)
                    return "Success";
            }
            catch (Exception Ex)
            {
                return Ex.Message;
            }
            return "Fail";
        }

        [WebMethod(EnableSession=true)]
        public string InsertOrder()
         {
             try
             {
                 ServiceReference1.ServiceSoapClient objService = new ServiceReference1.ServiceSoapClient("ServiceSoap1");
                 ServiceReference1.InsertOrderRequest list = new ServiceReference1.InsertOrderRequest();
                 //list.ts = 0;
                 MVCEFEntities objContext = new MVCEFEntities();
                 DataSet dsOrder = objContext.ExecuteDataSet("select * from tblorder where orderstatusid='1' ");
                 ServiceReference1.InsertOrderResponse resp = null;

                 //ServiceReference1.InsertOrderResponse resp = objService.InsertOrder(list);
                 //DataSet dataSet = JsonConvert.DeserializeObject<DataSet>(resp.InsertOrderResult);

                 /*
                 if (dsOrder != null && dsOrder.Tables.Count > 0)
                 {
                     foreach (DataRow row in dsOrder.Tables[0].Rows)
                     {

                         string sOrderId = row["OrderId"].ToString();
                         DataSet dsStore = objContext.ExecuteDataSet(string.Format(" select distinct storeid from tblorderdetail where orderid= {0} ", sOrderId));
                         if (dsStore != null && dsStore.Tables.Count > 0)
                         {
                             foreach (DataRow rowStore in dsStore.Tables[0].Rows)
                             {
                                 string sStoreId = rowStore["storeid"].ToString();
                                 DataSet dsOrderDetail = objContext.ExecuteDataSet(string.Format("select * from tblorderdetail where orderid= {0} and storeid", sOrderId, sStoreId));
                                 if (dsOrderDetail != null && dsOrderDetail.Tables.Count > 0)
                                 {
                                     foreach (DataRow rowOrder in dsOrderDetail.Tables[0].Rows)
                                     {
                                     }
                                 }
                                 else
                                 {
                                     return "Fail";
                                 }
                             }
                         }
                         else
                             return "Fail";

                     }

                 }
                 else
                 {
                     return "Fail";
                 }
                 */
                 if (dsOrder != null && dsOrder.Tables.Count > 0)
                 {
                     foreach (DataRow row in dsOrder.Tables[0].Rows)
                     {

                         string sOrderId = row["OrderId"].ToString();
                         DataSet dsOrderDetail = objContext.ExecuteDataSet(string.Format("exec spGetOrderDetailsInsert @customerid= {0}, @orderid ={1} ", Session["CustomerId"].ToString(), sOrderId));
                         DataSet dsStore = objContext.ExecuteDataSet(string.Format(" select * from dbo.tblStore where customerid= {0} and isactive=1 ", Session["CustomerId"].ToString() ));

                         if (dsOrderDetail != null && dsOrderDetail.Tables.Count > 0 && dsStore != null && dsStore.Tables.Count > 0)
                         {
                             DataRow dtOrderRow = dsOrderDetail.Tables[1].Rows[0];
                             foreach (DataRow rowStore in dsStore.Tables[0].Rows)
                             {
                                 string sStoreCode = rowStore["InternalStoreCode"].ToString();

                                 foreach (DataRow rowOrder in dsOrderDetail.Tables[0].Rows)
                                 {
                                     list = new ServiceReference1.InsertOrderRequest();
                                     list.sOrdNo = dtOrderRow["OrderNumber"].ToString();
                                     list.dtOrdDate = Convert.ToDateTime(dtOrderRow["OrderedDate"].ToString());
                                     list.dtDeliDate = Convert.ToDateTime(dtOrderRow["OrderedDate"]).AddDays(1);
                                     list.sCustNo = sStoreCode;
                                     list.sPoNo = "PO_Test";
                                     list.dDiscount = 0;
                                     list.dDiscountPer = 0;
                                     list.sAgentId = "";
                                     list.dtVoidDate = DateTime.Now;
                                     list.bVoid = 0;
                                     list.sRemarks = rowOrder["remarks"].ToString();

                                     list.arrayItemNo = rowOrder["skuid"].ToString();
                                     list.arrayUOM = "";
                                     list.arrayQty = rowOrder[sStoreCode].ToString();
                                     list.arrayPrice = rowOrder["price"].ToString();
                                     list.sMDTNo = "mq";
                                     list.arrayItemName = rowOrder["productname"].ToString();

                                     list.arrayPromoID = "0";
                                     list.arrayPromoOffer = "0";
                                     list.arrayDisPer = "0";
                                     list.arrayDisPr = "0";
                                     list.arraySubAmt = "0";
                                     list.arrLineNo = "0";

                                     list.sConditionMaster = "0";
                                     list.sConditionType = "0";
                                     list.sConditionValue = "0";
                                     resp = objService.InsertOrder(list);

                                 }

                             }
                         }
                         else
                             return "Fail";

                     }

                 }
                 else
                 {
                     return "Fail";
                 }

                 return "Success";
             }
             catch (Exception Ex)
             {
                 return Ex.Message;
             }
         }

        public string MergeProductByCustomer()
        {
            try
            {
                ServiceReference1.ServiceSoapClient objService = new ServiceReference1.ServiceSoapClient("ServiceSoap1");
                ServiceReference1.GetCustomerProductListRequest list = new ServiceReference1.GetCustomerProductListRequest();
                list.mdtNo = "mq";
                list.offset = 0;
                list.length = 1024;
                list.ts = 0;
                ServiceReference1.GetCustomerProductListResponse resp = objService.GetCustomerProductList(list);
                DataSet dataSet = JsonConvert.DeserializeObject<DataSet>(resp.GetCustomerProductListResult);
                //spMergeProduct '<Items><Item><Itemid>082193B20012P012G1</Itemid><ItemName>Test</ItemName><Price>20.50</Price><Available>10</Available><Active>1</Active></Item></Items>'
                string sXml = "<Items>";
                /*
                & - &amp;
                < - &lt;
                > - &gt;
                " - &quot;
                ' - &#39;
                */
                string item = "", itemname = "";
                foreach (DataRow row in dataSet.Tables["Result"].Rows)
                {
                    item = row["ItemID"].ToString();
                    item = item.Replace("&", "&amp;");
                    item = item.Replace("<", "&lt;");
                    item = item.Replace(">", "&gt;");
                    item = item.Replace("\"", "&quot;");
                    item = item.Replace("'", "&#39;");

                    itemname = row["ItemName"].ToString();
                    itemname = itemname.Replace("&", "&amp;");
                    itemname = itemname.Replace("<", "&lt;");
                    itemname = itemname.Replace(">", "&gt;");
                    itemname = itemname.Replace("\"", "&quot;");
                    itemname = itemname.Replace("'", "&#39;");

                    sXml = sXml + "<Item><CustNo>" + row["CustNo"] + "</CustNo><Itemid>" + item + "</Itemid><ItemName>" + itemname + "</ItemName><Price>" + row["Price"] + "</Price><Active>" + row["Active"] + "</Active></Item>";

                }
                sXml = sXml + "</Items>";
                MVCEFEntities objContext = new MVCEFEntities();
                object objResult = objContext.ExecuteObject(string.Format("exec spMergeProductByCustomer '{0}'", sXml));

                if (objResult != null && Convert.ToInt16(objResult) > 0)
                    return "Success";
            }
            catch (Exception Ex)
            {
                return Ex.Message;
            }
            return "Fail";
        }
    }
    public class GetItemsListResponseList
    {
        public List<ResultModel> Result { get; set; }
        public ErrorModel Error { get; set; }
        public TotalLengthModel TotalLength { get; set; }
        public DeleteConditionModel DeleteCondition { get; set; }
    }
    public class ResultModel
    {
        public string Itemid { get; set; }
        public string ItemName { get; set; }
        public string ChineseName { get; set; }
        public string ShortDesc { get; set; }
        public string Uom { get; set; }
        public string Price { get; set; }
        public string Available { get; set; }
        public string CategoryId { get; set; }
        public string FullDesc { get; set; }
        public string IncGst { get; set; }
        public string DisplayNo { get; set; }
        public string BarCode { get; set; }
        public string Hidden { get; set; }
        public string DTG { get; set; }
        public string ts { get; set; }
        public string Active { get; set; }
        public string Brand { get; set; }
        public string CompanyNo { get; set; }
    }
    public class ErrorModel
    {
        public string ErrorCode { get; set; }
    }
    public class TotalLengthModel
    {
        public string Offset { get; set; }
        public string Length { get; set; }
        public string TotalLength { get; set; }
    }
    public class DeleteConditionModel
    {
        public string Column { get; set; }
    }
}
