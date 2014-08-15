using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using MVCADOService;
using MVCDataModel;
using MVCBusinessModel.Abstract;
using System.Data;
using System.Data.OleDb;
using MVCEF.Infrastructure;
using System.IO;
using System.Web;
using MvcJqGrid;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Drawing;
using MVCBusinessModel.Mail;
using Newtonsoft.Json;
using System.Xml.Serialization;
using OrderingSystem;
using org.apache.pdfbox.pdmodel;
using org.apache.pdfbox.util;
using SatinLibs;

namespace MVCEF.Controllers
{
    public class HomeController : MyBaseController
    {
        private IHomeRepository objHomeRep = null;
        static log4net.ILog log = log4net.LogManager.GetLogger("HomeController");
        
        public HomeController(IHomeRepository objHomeRepository)
        {
            objHomeRep = objHomeRepository;

        }

        public ActionResult Index()
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).CustomerId = 0;
            ((SiteSession)HttpContext.Session["SiteSession"]).SelectedCustomerId = 0;
            ((SiteSession)HttpContext.Session["SiteSession"]).OrderId = 0;
            return View("Index");
        }
        public ActionResult About()
        {
            return View();
        }
        public ActionResult Settings()
        {
            return View();
        }

        [HttpPost]
        public string InsertOrder()
        {
            {
                try
                {
                    OrderingSystem.ServiceReference1.ServiceSoapClient objService = new OrderingSystem.ServiceReference1.ServiceSoapClient("ServiceSoap1");
                    OrderingSystem.ServiceReference1.InsertOrderRequest list = new OrderingSystem.ServiceReference1.InsertOrderRequest();
                    //list.ts = 0;
                    string sOrderNumbers = "";
                    MVCEFEntities objContext = new MVCEFEntities();
                    DataSet dsOrder = objContext.ExecuteDataSet("select * from tblorder where orderstatusid='1' ");
                    OrderingSystem.ServiceReference1.InsertOrderResponse resp = null;

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
                    if (dsOrder != null && dsOrder.Tables.Count > 0 && dsOrder.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow row in dsOrder.Tables[0].Rows)
                        {

                            string sOrderId = row["OrderId"].ToString();
                            string sOrderAmt = row["TotalAmount"].ToString();
                            DataSet dsOrderDetail = objContext.ExecuteDataSet(string.Format("exec spGetOrderDetailsInsert @customerid= {0}, @orderid ={1} ", Session["CustomerId"].ToString(), sOrderId));
                            DataSet dsStore = objContext.ExecuteDataSet(string.Format(" select * from dbo.tblStore where customerid= {0} and isactive=1 ", Session["CustomerId"].ToString()));

                            if (dsOrderDetail != null && dsOrderDetail.Tables.Count > 0 && dsStore != null && dsStore.Tables.Count > 0)
                            {
                                DataRow dtOrderRow = dsOrderDetail.Tables[1].Rows[0];
                                foreach (DataRow rowStore in dsStore.Tables[0].Rows)
                                {
                                    string sStoreCode = rowStore["InternalStoreCode"].ToString();

                                    foreach (DataRow rowOrder in dsOrderDetail.Tables[0].Rows)
                                    {
                                        list = new OrderingSystem.ServiceReference1.InsertOrderRequest();
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
                                        list.arraySubAmt = sOrderAmt;
                                        list.arrLineNo = "0";

                                        list.sConditionMaster = "0";
                                        list.sConditionType = "0";
                                        list.sConditionValue = "0";
                                        resp = objService.InsertOrder(list);

                                    }

                                }
                            }
                            else
                                return "Order details not found";

                            sOrderNumbers = sOrderNumbers + resp.InsertOrderResult + ",";
                            objContext.ExecuteQuery(string.Format(" update tblorder set orderstatusid = 2 where orderid= {0}  ", sOrderId));

                        }


                    }
                    else
                    {
                        return "Order not Pending";
                    }
                    sOrderNumbers = sOrderNumbers.Substring(0, sOrderNumbers.Length - 1);
                    return "Order Submitted - " + sOrderNumbers;
                }
                catch (Exception Ex)
                {
                    return Ex.Message;
                }
            }
        }

        [HttpPost]
        public string SynchCustomer()
        {
            try
            {
                OrderingSystem.ServiceReference1.ServiceSoapClient objService = new OrderingSystem.ServiceReference1.ServiceSoapClient("ServiceSoap1");
                OrderingSystem.ServiceReference1.GetCustomersListRequest list = new OrderingSystem.ServiceReference1.GetCustomersListRequest();
                list.mdtNo = "mq";
                list.offset = 0;
                list.length = 1024;
                list.ts = 0;
                OrderingSystem.ServiceReference1.GetCustomersListResponse resp = objService.GetCustomersList(list);
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
        [HttpPost]
        public string SynchPrice()
        {
            try
            {
                OrderingSystem.ServiceReference1.ServiceSoapClient objService = new OrderingSystem.ServiceReference1.ServiceSoapClient("ServiceSoap1");
                OrderingSystem.ServiceReference1.GetItemPriceListRequest list = new OrderingSystem.ServiceReference1.GetItemPriceListRequest();
                list.mdtNo = "mq";
                list.offset = 0;
                list.length = 1024;
                list.ts = 0;
                OrderingSystem.ServiceReference1.GetItemPriceListResponse resp = objService.GetItemPriceList(list);
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
        [HttpPost]
        public string SynchProduct()
        {
            try
            {
                OrderingSystem.ServiceReference1.ServiceSoapClient objService = new OrderingSystem.ServiceReference1.ServiceSoapClient("ServiceSoap1");
                OrderingSystem.ServiceReference1.GetItemsListRequest list = new OrderingSystem.ServiceReference1.GetItemsListRequest();
                list.mdtNo = "mq";
                list.offset = 0;
                list.length = 1024;
                list.ts = 0;
                OrderingSystem.ServiceReference1.GetItemsListResponse resp = objService.GetItemsList(list);
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

        public ActionResult Home()
        {

            return View();
        }
        public ActionResult Admin()
        {

            return View();
        }
        public ActionResult Mail()
        {
            MVCEFEntities objDal = new MVCEFEntities();
            tblMailSetting objItem = objDal.tblMailSettings.SingleOrDefault();
            return View(objItem);
        }

        public ActionResult Dashboard()
        {
            //for menu selection - show current menu
            Session["MenuUrl"] = "/Home/Dashboard";

            //menu selection - hide previous active menu
            Session["MenuId"] = "";

            //menu selection - hide previous active page
            Session["PageId"] = "";
            ((SiteSession)HttpContext.Session["SiteSession"]).OrderId = 0;
            return View();
        }

        public ActionResult OrderEntry()
        {
            return View("OrderEntry", DateTime.Now);
        }

        public ActionResult ViewOrder()
        {
            return View();
        }



        [HttpPost]
        public MvcHtmlString BindCustomer()
        {
            StringBuilder sbHtmlResult = new StringBuilder();

            DataTable dtCustomer = objHomeRep.BindCustomer();

            foreach (DataRow row in dtCustomer.Rows)
            {
                sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["CustomerId"], row["CustomerName"]));
            }

            MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
            return objResult;
        }
        [HttpPost]
        public MvcHtmlString BindMenu(int iCustomerId)
        {
            StringBuilder sbHtmlResult = new StringBuilder();

            DataTable dtResult = objHomeRep.BindMenu(iCustomerId);

            foreach (DataRow row in dtResult.Rows)
            {
                sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["MenuId"], row["MenuTitle"]));
            }

            MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
            return objResult;
        }
        [HttpPost]
        public MvcHtmlString BindGroup(int iCustomerId)
        {
            StringBuilder sbHtmlResult = new StringBuilder();

            DataTable dtResult = objHomeRep.BindGroup(iCustomerId);

            foreach (DataRow row in dtResult.Rows)
            {
                sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["GroupId"], row["GroupTitle"]));
            }

            MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
            return objResult;
        }

        [HttpPost]
        public MvcHtmlString BindRole(int iCustomerId)
        {
            //assign selected customer id for lookup - query
            ((SiteSession)HttpContext.Session["SiteSession"]).SelectedCustomerId = iCustomerId;

            StringBuilder sbHtmlResult = new StringBuilder();

            DataTable dtResult = objHomeRep.BindRole(iCustomerId);

            foreach (DataRow row in dtResult.Rows)
            {
                sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["RoleID"], row["RoleName"]));
            }

            MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
            return objResult;
        }

        [HttpPost]
        public MvcHtmlString BindActiveAccount(int iCustomerId)
        {
            //assign selected customer id for lookup - query
            ((SiteSession)HttpContext.Session["SiteSession"]).SelectedCustomerId = iCustomerId;

            StringBuilder sbHtmlResult = new StringBuilder();

            DataTable dtResult = objHomeRep.BindAccount(iCustomerId);
            DataRow[] rows = null;
            if (dtResult != null)
                rows = dtResult.Select("Status = 1");

            foreach (DataRow row in rows)
            {
                sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Id"], row["Account"]));
            }

            MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
            return objResult;
        }
        [HttpPost]
        public MvcHtmlString BindAccount(int iCustomerId)
        {
            //assign selected customer id for lookup - query
            ((SiteSession)HttpContext.Session["SiteSession"]).SelectedCustomerId = iCustomerId;

            StringBuilder sbHtmlResult = new StringBuilder();

            DataTable dtResult = objHomeRep.BindAccount(iCustomerId);

            foreach (DataRow row in dtResult.Rows)
            {
                sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Id"], row["Account"]));
            }

            MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
            return objResult;
        }

        [HttpPost]
        public MvcHtmlString BindMenuOrder(int iCustomerId)
        {
            StringBuilder sbHtmlResult = new StringBuilder();
            int iOrderValue = 1;
            int? iCount = objHomeRep.MenuCount(iCustomerId);
            iCount++;
            while (iOrderValue <= iCount)
            {
                sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", iCount, iCount));
                iCount--;
            }

            MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
            return objResult;
        }
        [HttpPost]
        public MvcHtmlString BindGroupOrder(int iCustomerId)
        {
            StringBuilder sbHtmlResult = new StringBuilder();
            int iOrderValue = 1;
            int? iCount = objHomeRep.GroupCount(iCustomerId);
            iCount++;
            while (iOrderValue <= iCount)
            {
                sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", iCount, iCount));
                iCount--;
            }

            MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
            return objResult;
        }
        [HttpPost]
        public MvcHtmlString BindMenuPageOrder(int iCustomerId)
        {
            StringBuilder sbHtmlResult = new StringBuilder();
            int iOrderValue = 1;
            int? iCount = objHomeRep.MenuPageCount(iCustomerId);
            iCount++;
            while (iOrderValue <= iCount)
            {
                sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", iCount, iCount));
                iCount--;
            }

            MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
            return objResult;
        }

        //[HttpPost]
        public void SelectCustomer(int iCustomerId)
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).CustomerId = iCustomerId;
            ((SiteSession)HttpContext.Session["SiteSession"]).SelectedCustomerId = iCustomerId;

            tblCustomer objCustomer = objHomeRep.GetCustomerById(iCustomerId);
            if (objCustomer != null)
            {
                Session["CustomerId"] = objCustomer.CustomerId;
                Session["CustomerName"] = objCustomer.CustomerName;
            }
        }

        [HttpPost]
        public void ChangeAccount(string sAccount)
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).AccountID = sAccount;
        }

        [HttpPost]
        public void ChangeSubGroup(string sSubGroupID)
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).SubGroupID = sSubGroupID;
        }

        [HttpPost]
        public JsonResult GetDefaultMenuAndPage()
        {
            tblDefaultMenuPage objMenuPage = objHomeRep.GetDefaultMenuAndPage();

            //menu selection - current active menu
            if (objMenuPage == null)
                return null;

            Session["MenuId"] = objMenuPage.MenuId;

            JsonResult jsonResult = Json(objMenuPage, JsonRequestBehavior.AllowGet);
            return jsonResult;
        }

        [HttpPost]
        public void AssignLookupProperties(string sLookupName, string sQuery)
        {
            TempData[sLookupName] = sQuery;
        }
        [HttpPost]
        public JsonResult LoadLookup(LookupModel model)
        {
            object sResult = objHomeRep.LoadLookup(model);
            JsonResult jsonResult = Json(sResult, JsonRequestBehavior.AllowGet);
            return jsonResult;
        }
        [HttpPost]
        public JsonResult LoadRadioItem(CustomRadioModel model)
        {
            object sResult = objHomeRep.LoadRadioItem(model);
            JsonResult jsonResult = Json(sResult, JsonRequestBehavior.AllowGet);
            return jsonResult;
        }

        #region Order Entry

        public ActionResult GridDataOrderDashboard(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objHomeRep.GridDataOrderDashboard(objGrdSettings);

                JsonResult result = Json(objJsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        public JsonResult BindStore()
        {
            try
            {

                string dsResult = null;
                dsResult = objHomeRep.BindStore();
                JsonResult result = Json(dsResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return Json("", JsonRequestBehavior.AllowGet);
            //return "";
        }



        public JsonResult BindProduct(string query)
        {
            try
            {

                string dsResult = null;
                if (!string.IsNullOrEmpty(query))
                {
                    dsResult = objHomeRep.BindProduct(query);
                    JsonResult result = Json(dsResult, JsonRequestBehavior.AllowGet);
                    return result;
                    //return dsResult;
                }
            }
            catch (Exception Ex)
            {
            }
            return Json("", JsonRequestBehavior.AllowGet);
            //return "";
        }

        public JsonResult BindProductCode(string query)
        {
            try
            {

                string dsResult = null;
                if (!string.IsNullOrEmpty(query))
                {
                    dsResult = objHomeRep.BindProductCode(query);
                    JsonResult result = Json(dsResult, JsonRequestBehavior.AllowGet);
                    return result;
                    //return dsResult;
                }
            }
            catch (Exception Ex)
            {
            }
            return Json("", JsonRequestBehavior.AllowGet);
            //return "";
        }

        public JsonResult SaveOrders(string total, string orderby, string phone, string remarks, string data, string header)
        {

            try
            {
                Newtonsoft.Json.Linq.JArray jData = JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JArray>(data);
                Newtonsoft.Json.Linq.JArray jHeader = JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JArray>(header);

                DataTable dtResult = new DataTable("Order");
                //StringBuilder sbOrders = new StringBuilder();
                //sbOrders.Append("<Orders>");
                foreach (var item in jHeader)
                {
                    dtResult.Columns.Add(item.ToString());
                }
                string name = "";
                foreach (var row in jData)
                {
                    DataRow dr = dtResult.NewRow();
                    //sbOrders.Append("<Order>");
                    for (int i = 0; i < dtResult.Columns.Count; i++)
                    {
                        if (row[i].ToString() == "")
                            dr[i] = "0";
                        else
                            dr[i] = row[i].ToString();

                        name = jHeader[i].ToString();
                        //sbOrders.Append("<" + name + ">" + row[i].ToString() + "</" + name + ">");
                    }
                    dtResult.Rows.Add(dr);
                    //sbOrders.Append("</Order>");
                }

                //sbOrders.Append("</Orders>");
                string dsResult = "";// ToXml(dtResult);
                dsResult = objHomeRep.SaveOrders(total, orderby, phone, remarks, dtResult);
                JsonResult result = Json(dsResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return Json("", JsonRequestBehavior.AllowGet);
        }
        // By using this method we can convert datatable to xml
        private string ToXml(DataTable ds)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (TextWriter streamWriter = new StreamWriter(memoryStream))
                {
                    var xmlSerializer = new XmlSerializer(typeof(DataTable));
                    xmlSerializer.Serialize(streamWriter, ds);
                    return Encoding.UTF8.GetString(memoryStream.ToArray());
                }
            }
        }
        private string ConvertDatatableToXML(DataTable dt)
        {
            MemoryStream str = new MemoryStream();
            dt.WriteXml(str, XmlWriteMode.IgnoreSchema);
            str.Seek(0, SeekOrigin.Begin);
            StreamReader sr = new StreamReader(str);
            string xmlstr;
            xmlstr = sr.ReadToEnd();
            return (xmlstr);
        }

        public void LoadOrderId(int orderid)
        {
            //Session["OrderBy"] = "";
            //Session["Phone1"] = "";
            //Session["Remarks"] = "";
            ((SiteSession)HttpContext.Session["SiteSession"]).OrderId = orderid;
        }
        public JsonResult LoadOrders()
        {
            try
            {
                string dsResult = null;
                dsResult = objHomeRep.LoadOrders();
                JsonResult result = Json(dsResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return Json("", JsonRequestBehavior.AllowGet);
            //return "";
        }

        [HttpPost]
        public FilePathResult Download(string OrderId)
        {
            try
            {
                string sResult = "";
                sResult = objHomeRep.Download(OrderId);
                if (!string.IsNullOrEmpty(sResult))
                {
                    System.IO.FileInfo file = new System.IO.FileInfo(sResult);
                    return File(sResult, "text/plain", file.Name);
                }
                else
                    return null;
            }
            catch (Exception Ex)
            {
                return null; // Json("", JsonRequestBehavior.AllowGet);
            }
        }


        public JsonResult CheckOrder()
        {
            try
            {

                string dsResult = null;
                dsResult = objHomeRep.CheckOrder();
                JsonResult result = Json(dsResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return Json("", JsonRequestBehavior.AllowGet);
            //return "";
        }



        public void ExportOrderDashboard(string model)
        {
            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    objHomeRep.ExportOrderDashboard(exportModel);
            }
            catch (Exception Ex)
            {
            }


        }

        public string PrintOrderDashboard(string model)
        {

            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    return objHomeRep.PrintOrderDashboard(exportModel);
            }
            catch (Exception Ex)
            {
            }
            return "";
        }
        #endregion


        [HttpPost]
        public ActionResult SaveMailSettings(string viewModel)
        {
            int iCheck = -1;
            try
            {

                tblMailSetting objItem = JsonConvert.DeserializeObject<tblMailSetting>(viewModel);

                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;

                }
                iCheck = -1;
                //objAdminRepository.UpdateMenu(objMenu);
                MVCEFEntities objContext = new MVCEFEntities();
                objContext.tblMailSettings.Attach(objItem);
                objContext.ObjectStateManager.ChangeObjectState(objItem, EntityState.Modified);
                iCheck = objContext.SaveChanges();

                if (iCheck > 0)
                {
                    sJsonResult = SUCCESS;
                    sJsonMsg = UPDATE_SUCCESS;

                    ModelState.Clear();
                    ViewData.Clear();
                }
                else
                {
                    sJsonResult = FAIL;
                    sJsonMsg = UPDATE_FAIL;
                }

            }
            catch (Exception Ex)
            {
            }
            return jSONResult;
        }

        #region Product Code

        public ActionResult Product()
        {
            return View("Product");
        }

        public ActionResult GridDataProduct(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objHomeRep.GridDataProduct(objGrdSettings);

                JsonResult result = Json(objJsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult CreateProduct()
        {
            try
            {
                spProductManagement_Result objTank = new spProductManagement_Result();
                ViewBag.IsUpdate = false;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Product", objTank)
                };

                if (Request.IsAjaxRequest())
                {
                    JsonResult result = Json(jsonResult, JsonRequestBehavior.AllowGet);
                    return result;
                }
            }
            catch (Exception Ex)
            {
            }
            return null;

        }

        [HttpPost]
        public JsonResult EditProductId(int iId)
        {
            try
            {
                spProductManagement_Result objTank = new spProductManagement_Result();
                string sResult = objHomeRep.GetProduct(iId);
                ViewBag.IsUpdate = true;

                if (objTank == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Product", objTank),
                    model = sResult
                };

                if (Request.IsAjaxRequest())
                {
                    JsonResult result = Json(jsonResult, JsonRequestBehavior.AllowGet);
                    return result;
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult CreateEditProduct(string viewModel, string sCommand)
        {
            int iCheck = -1;
            try
            {
                spProductManagement_Result objProduct = JsonConvert.DeserializeObject<spProductManagement_Result>(viewModel);

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }
                if (sCommand == "Add")
                {

                    iCheck = objHomeRep.AddProduct(objProduct);

                    if (iCheck > 0)
                    {
                        sJsonResult = SUCCESS;
                        sJsonMsg = ADD_SUCCESS;

                        ModelState.Clear();
                        ViewData.Clear();
                    }
                    else
                    {
                        sJsonResult = FAIL;
                        sJsonMsg = ADD_FAIL;
                    }
                }
                if (sCommand == "Update")
                {

                    iCheck = objHomeRep.UpdateProduct(objProduct);

                    if (iCheck > 0)
                    {
                        sJsonResult = SUCCESS;
                        sJsonMsg = UPDATE_SUCCESS;

                        ModelState.Clear();
                        ViewData.Clear();
                    }
                    else
                    {
                        sJsonResult = FAIL;
                        sJsonMsg = UPDATE_FAIL;
                    }
                }
            }
            catch (Exception Ex)
            {
            }
            return jSONResult;
        }

        [HttpPost]
        public ActionResult DeleteProduct(string sIds)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objHomeRep.DeleteProduct(sIds);

                    if (iCheck > 0)
                    {
                        sJsonResult = SUCCESS;
                        sJsonMsg = DELETE_SUCCESS;

                        ModelState.Clear();
                        ViewData.Clear();
                    }
                    else
                    {
                        sJsonResult = FAIL;
                        sJsonMsg = DELETE_FAIL;
                    }
                }
                else
                {
                    sJsonResult = FAIL;
                    sJsonMsg = IS_NOT_AJAX_REQUEST;
                    return jSONResult;
                }
            }
            catch (Exception Ex)
            {
            }
            return jSONResult;
        }
        public void ExportProduct(string model)
        {
            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    objHomeRep.ExportProduct(exportModel);
            }
            catch (Exception Ex)
            {
            }


        }

        public string PrintProduct(string model)
        {

            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    return objHomeRep.PrintProduct(exportModel);
            }
            catch (Exception Ex)
            {
            }
            return "";
        }
        #endregion




        #region Customer

        public ActionResult Customer()
        {
            return View("Customer");
        }

        public ActionResult GridDataCustomer(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objHomeRep.GridDataCustomer(objGrdSettings);

                JsonResult result = Json(objJsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult CreateCustomer()
        {
            try
            {
                spCustomerManagement_Result objTank = new spCustomerManagement_Result();
                ViewBag.IsUpdate = false;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Customer", objTank)
                };

                if (Request.IsAjaxRequest())
                {
                    JsonResult result = Json(jsonResult, JsonRequestBehavior.AllowGet);
                    return result;
                }
            }
            catch (Exception Ex)
            {
            }
            return null;

        }

        [HttpPost]
        public JsonResult EditCustomerId(int iId)
        {
            try
            {
                spCustomerManagement_Result objTank = new spCustomerManagement_Result();
                string sResult = objHomeRep.GetCustomer(iId);
                ViewBag.IsUpdate = true;

                if (objTank == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Customer", objTank),
                    model = sResult
                };

                if (Request.IsAjaxRequest())
                {
                    JsonResult result = Json(jsonResult, JsonRequestBehavior.AllowGet);
                    return result;
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult CreateEditCustomer(string viewModel, string sCommand)
        {
            int iCheck = -1;
            try
            {
                spCustomerManagement_Result objCustomer = JsonConvert.DeserializeObject<spCustomerManagement_Result>(viewModel);

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }
                if (sCommand == "Add")
                {

                    iCheck = objHomeRep.AddCustomer(objCustomer);

                    if (iCheck > 0)
                    {
                        sJsonResult = SUCCESS;
                        sJsonMsg = ADD_SUCCESS;

                        ModelState.Clear();
                        ViewData.Clear();
                    }
                    else
                    {
                        sJsonResult = FAIL;
                        sJsonMsg = ADD_FAIL;
                    }
                }
                if (sCommand == "Update")
                {

                    iCheck = objHomeRep.UpdateCustomer(objCustomer);

                    if (iCheck > 0)
                    {
                        sJsonResult = SUCCESS;
                        sJsonMsg = UPDATE_SUCCESS;

                        ModelState.Clear();
                        ViewData.Clear();
                    }
                    else
                    {
                        sJsonResult = FAIL;
                        sJsonMsg = UPDATE_FAIL;
                    }
                }
            }
            catch (Exception Ex)
            {
            }
            return jSONResult;
        }

        [HttpPost]
        public ActionResult DeleteCustomer(string sIds)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objHomeRep.DeleteCustomer(sIds);

                    if (iCheck > 0)
                    {
                        sJsonResult = SUCCESS;
                        sJsonMsg = DELETE_SUCCESS;

                        ModelState.Clear();
                        ViewData.Clear();
                    }
                    else
                    {
                        sJsonResult = FAIL;
                        sJsonMsg = DELETE_FAIL;
                    }
                }
                else
                {
                    sJsonResult = FAIL;
                    sJsonMsg = IS_NOT_AJAX_REQUEST;
                    return jSONResult;
                }
            }
            catch (Exception Ex)
            {
            }
            return jSONResult;
        }

        #endregion

        #region SatinPh1
        public ActionResult GridAllDataOrderDashboard(GridSettings objGrdSettings)
        {
            try
            {
                SatInHomeRepository satinHomeRepository = new SatInHomeRepository();
                object objJsonResult = satinHomeRepository.GridDataOrderDashboard(objGrdSettings);

                JsonResult result = Json(objJsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        public string LoadCustomersList()
        {
            CustomerUtils customerUtils = new CustomerUtils();
            DataSet dsResult = customerUtils.getAllCustomersDataSet();
            return dsResult.Tables[0].ToJSONString();
        }

        public ActionResult OrderUpload()
        {
            return View();
        }

        [HttpPost]
        public object UploadOrder(HttpPostedFileBase files)
        {
            log.Info("Uploading new order");
            JsonResult result = Json("", JsonRequestBehavior.AllowGet);
            try
            {
                HttpPostedFileBase file = Request.Files["file"];
                string customerId = Request.Params["customerDD"];
                string[] validateArr = ValidatorUtil.validateUploadedFile(file, customerId);
                if (validateArr[0].Equals(IConstants.FAILED))
                {
                    result = Json(validateArr, JsonRequestBehavior.AllowGet);
                }else
                {
                    DataSet dataSet = UploadFile(file, customerId);
                    string[] stringArr = new string[dataSet.Tables.Count];
                    for (int i = 0; i < dataSet.Tables.Count; i++)
                    {
                        string dsResult = dataSet.Tables[i].ToJSONString();
                        stringArr[i] = dsResult;
                    }
                    result = Json(stringArr, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
                string[] errorMesssage = new string[2];
                errorMesssage[0] = IConstants.FAILED;
                errorMesssage[1] = "Message: " + Ex.Message + "</br>InnerException: " + Ex.InnerException  + "</br>StackTrace: " + Ex.StackTrace;
                result = Json(errorMesssage, JsonRequestBehavior.AllowGet);
            }
            return result;
        }
        private DataSet UploadFile(HttpPostedFileBase file,string customerId)
        {
            string fileLocation = Server.MapPath("~/Content/") + file.FileName;
            if (System.IO.File.Exists(fileLocation))
            {
                System.IO.File.Delete(fileLocation);
            }
            Request.Files["file"].SaveAs(fileLocation);
            UploaderUtil uploaderUtil = new UploaderUtil();
            DataSet dataSet = uploaderUtil.UploadFile(customerId, file, fileLocation);
            return dataSet;
        }
        #endregion

        public JsonResult SaveUploadedOrder(string total, string orderby, string phone, string remarks, string data, string header)
        {
            SatInHomeRepository satinHomeRepository = new SatInHomeRepository();
            string customerId = Request.Params["customerId"];

            Dictionary<string, string> map = satinHomeRepository.SaveUploadedOrders(total, orderby, phone, remarks, data, header, customerId);
            return Json(map, JsonRequestBehavior.AllowGet);

        }


    }
}
