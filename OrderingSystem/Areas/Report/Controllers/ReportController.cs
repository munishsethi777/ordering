using System;
using System.Web;
using System.Web.Mvc;
using MVCBusinessModel.Abstract.Report;
using System.Data;
using System.Text;
using MVCDataModel;
using MvcJqGrid;

namespace DMS.Areas.Report.Controllers
{
    public enum ReportName : int
    {
        ReportTank = 0,
        ReportConsumption = 1,
        ReportReorderHitByDate = 2,
        ReportReorderAfterconsumption = 3,
        ReportTankNoInventory = 4,
        ReportRecorderStatus = 5,
        ReportDeliveryStatus = 6,
        ReportTrueup = 7,
        ReportTrueUpSummary = 8,
        ReportTankManagement = 9,
        ReportHistoricInventoryBalance = 10

    }

    public class ReportController : MyBaseController
    {

        private IReportRepository objReportRep = null;
        public ReportController(IReportRepository objRepository)
        {
            objReportRep = objRepository;
        }

        #region Reports
        // Tank Report
        public ActionResult ReportTank()
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).ClearValues();
            return View("ReportTank");
        }

        // Consuption Report
        public ActionResult ReportConsumption()
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).ClearValues();
            return View("ReportConsumption");
        }

        // Reorder Hit By Date
        public ActionResult ReportReorderHitByDate()
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).ClearValues();
            return View("ReportReorderHitByDate");
        }

        //Reorder hit after specified consumption
        public ActionResult ReportReorderAfterconsumption()
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).ClearValues();
            return View("ReportReorderAfterconsumption");
        }

        //Tanks with no inventory changes for last 24 hrs
        public ActionResult ReportTankNoInventory()
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).ClearValues();
            return View("ReportTankNoInventory");

        }
        //Tanks Kept In Reorder Status
        public ActionResult ReportReorderStatus()
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).ClearValues();
            return View("ReportReorderStatus");
        }

        //Delievery Status Report
        public ActionResult ReportDeliveryStatus()
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).ClearValues();
            return View("ReportDeliveryStatus");
        }

        //True up Report
        public ActionResult ReportTrueup()
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).ClearValues();
            return View("ReportTrueup");
        }

        //True-up Summary Report 
        public ActionResult ReportTrueUpSummary()
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).ClearValues();
            return View("ReportTrueUpSummary");
        }
        //Tank Management Report 
        public ActionResult ReportTankManagement()
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).ClearValues();
            return View("ReportTankManagement");
        }

        //Historic Inventory Balance
        public ActionResult ReportHistoricInventoryBalance()
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).ClearValues();
            return View("ReportHistoricInventoryBalance");
        }


        
        [HttpPost]
        public MvcHtmlString GetAllTanks(int iCustomerId, string sAccountId, string sSiteId, int iFleetId, int iProductId, int iGroupId, int iSubGroupId)
        {
            try
            {


                DataTable objTanks = objReportRep.GetAllTanks(iCustomerId, sAccountId, sSiteId, iFleetId, iProductId, iGroupId, iSubGroupId);
                StringBuilder sbHtmlResult = new StringBuilder();
                sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", 0, "ALL"));

                foreach (DataRow row in objTanks.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["TankID"], row["TankName"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;

            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        #endregion


        #region GNFO Reports - for ATT
        public ActionResult WeeklyInvoice()
        {
            return View("WeeklyInvoice");
        }
        public ActionResult SummaryByProduct()
        {
            return View("SummaryByProduct");
        }
        public ActionResult SummaryByState()
        {
            return View("SummaryByState");
        }
        public ActionResult SummaryByCLLICode()
        {
            return View("SummaryByCLLICode");
        }
        public ActionResult SummaryByRC()
        {
            return View("SummaryByRC");
        }
        public ActionResult InvoiceSummary()
        {
            return View("InvoiceSummary");
        }
        public ActionResult SummaryByPM2()
        {
            return View();
        }
        public ActionResult SummaryByPM3()
        {
            return View();
        }
        public ActionResult DeliveryDetail()
        {
            return View();
        }
        public ActionResult DyedDieselPurchase()
        {
            return View();
        }
         public ActionResult StateFuelTracking()
        {
            return View();
        }

        #endregion


        // delivery collection
        public ViewResult DeliveryCollection(string AccountID, string SiteID, string GroupID, string SubGroupID, DateTime? FromDate, DateTime? ToDate, short? IsAvg, decimal? Consumption, short? IsReorderOREmpty, short RptType)
        {
            if (((SiteSession)HttpContext.Session["SiteSession"]) != null)
            {
                ((SiteSession)HttpContext.Session["SiteSession"]).AccountID = (AccountID != null) ? AccountID.Trim() : "";
                ((SiteSession)HttpContext.Session["SiteSession"]).SiteID = (SiteID != null) ? SiteID.Trim() : "";
                ((SiteSession)HttpContext.Session["SiteSession"]).GroupID = (GroupID != null) ? GroupID.Trim() : "";
                ((SiteSession)HttpContext.Session["SiteSession"]).SubGroupID = (SubGroupID != null) ? SubGroupID.Trim() : "";
                ((SiteSession)HttpContext.Session["SiteSession"]).FromDate = (FromDate != null) ? FromDate.Value : DateTime.Now ;
                ((SiteSession)HttpContext.Session["SiteSession"]).ToDate = (ToDate != null) ? ToDate.Value : DateTime.Now;
                ((SiteSession)HttpContext.Session["SiteSession"]).IsAvg = (IsAvg != null) ? IsAvg.Value : short.MinValue;
                ((SiteSession)HttpContext.Session["SiteSession"]).RptType = RptType;
                ((SiteSession)HttpContext.Session["SiteSession"]).Consumption = (Consumption != null) ? Consumption.Value : 0;
                ((SiteSession)HttpContext.Session["SiteSession"]).IsReorderOREmpty = (IsReorderOREmpty != null) ? IsReorderOREmpty.Value : short.MinValue;
            }

            //initialise the caching
            Session["TankDeliveryCollection"] = null;

            return View();
        }

        //, short sAvg, string CustomerID, string customer, string AccountID, string SiteID, int GroupID, int SubGroupID, int ProductID, string SoryBy
        public ActionResult GridDataTankDeliveryCollection(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objReportRep.GridDataTankDeliveryCollection(objGrdSettings);

                JsonResult result = Json(objJsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public ActionResult DeleteTankDeliveryCollection(int iTankId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objReportRep.DeleteTankDeliveryCollection(iTankId);
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
    }
}
