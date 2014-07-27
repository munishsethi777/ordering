using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using MVCDataModel;
using System.Web.Script.Serialization;
using MVCBusinessModel.Abstract.Dispatch;

namespace DMS.Areas.Dispatch.Controllers
{
    public class DispatchController : MyBaseController
    {
        private IDispatchRepository objDispatchRepository = null;

        public DispatchController(IDispatchRepository objRepository)
        {
            objDispatchRepository = objRepository;
        }

        //
        // GET: /Dispatch/

        public ActionResult Index()
        {
            return View();
        }


        public ActionResult GetOrderEntries(string CustomerID="", string Destination="", string Product="", int Capacity=0)
        {
            try
            {
                List<spGetOrderEntries_Result> entries = objDispatchRepository.GetOrderEntries(CustomerID, Destination, Product, Capacity).ToList();
                return Json(entries, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
            }

            return null;

        }

        [HttpPost]
        public ActionResult SaveOrderEntries(int TankID, int ProductID, int SupplyPtID, int SupplierID, int CarrierID, int ShipToID, int OrderQuantity, string PONumber)
        {
            try
            {
                objDispatchRepository.SaveOrderEntries(TankID, SupplierID, SupplyPtID, CarrierID, ShipToID, ProductID, PONumber, OrderQuantity);
                return Json(new { result = "Success", message = "Record saved successfully" }); 

            }
            catch (Exception Ex)
            {
            }
            return null;
        }


        public ActionResult DeleteItem(string ID, string TankID)
        {
            try
            {
                objDispatchRepository.DeleteItem(TankID, ID);
                return Json(new { result = "Success", message = "Record deleted successfully" }); 
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        public ActionResult SaveApproved(string ApprovedItems)
        {
            try
            {
                var jsonResult = new
                {
                    result = "Success",
                    message = "Record Saved Successfully"
                };
                var js = new JavaScriptSerializer();
                List<ApprovedItems> desearialize = js.Deserialize<List<ApprovedItems>>(ApprovedItems);
                string sID = "", sTankID = "";

                if (desearialize != null)
                {
                    foreach (ApprovedItems item in desearialize)
                    {
                        sID += item.ID + ",";
                        sTankID += item.TankId + ",";
                    }


                    if (sID.Length > 1)
                    {

                        int iResult = objDispatchRepository.SaveApproved(sTankID.Substring(0, sTankID.Length - 1), sID.Substring(0, sID.Length - 1));
                        if (iResult > 0)
                        {
                            return Json(new { result = "Success", message = "Record Saved Successfully" });
                        }

                        return null;
                    }
                }
                //return Json(new { result = "Success", message = "Record Saved Successfully" });
                jsonResult = new
                {
                    result = "Success",
                    message = "Record Saved Successfully"
                };
                return Json(jsonResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
            }
            return null;
        }


        public ActionResult UploadDispatch()
        {

            try
            {
                var objResult = objDispatchRepository.UploadDispatch();
                return Json(objResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception objExp)
            {
                return Json(new { result = "Success", message = "/" + objExp.Message + "/" }); 
            }

            //return Json(null);
        }

    }
     
}
