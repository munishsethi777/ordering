using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using MvcJqGrid;
using Newtonsoft.Json;
using MVCDataModel;
using MVCBusinessModel.Abstract.DMS;
using System.Data;
using System.Configuration;
using MVCBusinessModel.Mail;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Text;

namespace DMS.Areas.DMS.Controllers
{
    public class DMSController : MyBaseController
    {
        private IDMSRepository objDMSRep = null;
        public DMSController(IDMSRepository objRepository)
        {
            objDMSRep = objRepository;
        }

        //
        // GET: /DMS/DMS/
        public ActionResult Index()
        {
            return View();
        }

        #region Group Controller Action
        public ActionResult Group()
        {
            return View("Group");
        }

        public ActionResult GridDataGroup(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objDMSRep.GridDataGroup(objGrdSettings);

                JsonResult result = Json(objJsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult CreateGroup()
        {
            try
            {

                spTankGroupManagement_Result objGroup = new spTankGroupManagement_Result();

                ViewBag.IsUpdate = false;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Group", objGroup)
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
        public JsonResult EditGroupId(int iGroupId)
        {
            try
            {
                spTankGroupManagement_Result objGroup = objDMSRep.GetGroup(iGroupId);
                ViewBag.IsUpdate = true;

                if (objGroup == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Group", objGroup),
                    model = objGroup
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
        public JsonResult CreateEditGroup(string viewModel, string sCommand)
        {
            int iCheck = -1;
            try
            {
                spTankGroupManagement_Result objGroup = JsonConvert.DeserializeObject<spTankGroupManagement_Result>(viewModel);

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }
                if (sCommand == "Add")
                {
                    iCheck = objDMSRep.AddGroup(objGroup);
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

                    iCheck = objDMSRep.UpdateGroup(objGroup);
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
        public ActionResult DeleteGroup(string iGroupId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objDMSRep.DeleteGroup(iGroupId);

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
        public void ExportGroup(string model)
        {
            try
            {
                ExportGridModel exportModel = null;
                if(model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if(exportModel != null)
                    objDMSRep.ExportGroup(exportModel);
            }
            catch (Exception Ex)
            {
            }
        }

        public string PrintGroup(string model)
        {
            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    return objDMSRep.PrintGroup(exportModel);
            }
            catch (Exception Ex)
            {
            }
            return "";
        }
        #endregion

        #region Tank Sub Group Action
        public ActionResult TankSubGroup()
        {
            return View("TankSubGroup");
        }

        public ActionResult GridDataTankSubGroup(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objDMSRep.GridDataTankSubGroup(objGrdSettings);
                JsonResult result = Json(objJsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult CreateTankSubGroup()
        {
            try
            {
                spTankSubGroupManagement_Result objTankSubGroup = new spTankSubGroupManagement_Result();
                ViewBag.IsUpdate = false;
                var jsonResult = new
                {
                    view = RenderPartialViewToString("_TankSubGroup", objTankSubGroup)
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
        public JsonResult EditTankSubGroupId(int iTankSubGroupId)
        {
            try
            {
                spTankSubGroupManagement_Result objTankSubGrop = objDMSRep.GetTankSubGroup(iTankSubGroupId);
                ViewBag.IsUpdate = true;

                if (objTankSubGrop == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_TankSubGroup", objTankSubGrop),
                    model = objTankSubGrop
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
        public JsonResult CreateEditTankSubGroup(string viewModel, string sCommand)
        {
            int iCheck = -1;
            try
            {
                spTankSubGroupManagement_Result objTankSubGroup = JsonConvert.DeserializeObject<spTankSubGroupManagement_Result>(viewModel);

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }
                if (sCommand == "Add")
                {
                    iCheck = objDMSRep.AddTankSubGroup(objTankSubGroup);
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

                    iCheck = objDMSRep.UpdateAddTankSubGroup(objTankSubGroup);

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
        public ActionResult DeleteTankSubGroup(string iTankSubGroupId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objDMSRep.DeleteTankSubGroup(iTankSubGroupId);
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


        public void ExportTankSubGroup(string model)
        {

            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    objDMSRep.ExportTankSubGroup(exportModel);
            }
            catch (Exception Ex)
            {
            }

        }

        public string PrintTankSubGroup(string model)
        {

            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    return objDMSRep.PrintTankSubGroup(exportModel);
            }
            catch (Exception Ex)
            {
            }
            return "";

        }

        #endregion

        #region Tank Group User Action


        public ActionResult TankGroupUser()
        {
            return View("TankGroupUser");
        }

        public ActionResult GridDataTankGroupUser(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objDMSRep.GridDataTankGroupUser(objGrdSettings);

                JsonResult result = Json(objJsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult CreateTankGroupUser()
        {
            try
            {


                spTankGroupUserManagement_Result objTankGroupUser = new spTankGroupUserManagement_Result();

                ViewBag.IsUpdate = false;



                var jsonResult = new
                {
                    view = RenderPartialViewToString("_TankGroupUser", objTankGroupUser)
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
        public JsonResult EditTankGroupUserId(int iTankGroupUserId)
        {
            try
            {


                spTankGroupUserManagement_Result objTankGrop = objDMSRep.GetTankGroupUser(iTankGroupUserId);

                ViewBag.IsUpdate = true;

                if (objTankGrop == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_TankGroupUser", objTankGrop),
                    model = objTankGrop
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
        public JsonResult CreateEditTankGroupUser(string viewModel, string sCommand)
        {
            int iCheck = -1;
            bool bResult = false;


            try
            {

                spTankGroupUserManagement_Result objTankGroup = JsonConvert.DeserializeObject<spTankGroupUserManagement_Result>(viewModel);

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }
                if (sCommand == "Add")
                {


                    iCheck = objDMSRep.AddTankGroupUser(objTankGroup);


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

                    iCheck = objDMSRep.UpdateAddTankGroupUser(objTankGroup);

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
        public ActionResult DeleteTankGroupUser(string iTankGroupUserId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objDMSRep.DeleteTankGroupUser(iTankGroupUserId);

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


        public void ExportTankGroupUser(string model)
        {

            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    objDMSRep.ExportTankGroupUser(exportModel);
            }
            catch (Exception Ex)
            {
            }

        }

        public string PrintTankGroupUser(string model)
        {

            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    return objDMSRep.PrintTankGroupUser(exportModel);
            }
            catch (Exception Ex)
            {
            }
            return "";

        }


        #endregion

        #region Manage Customer Account Action


        public ActionResult ManageAccount()
        {
            return View("ManageAccount");
        }

        public ActionResult GridDataCustomerAccount(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objDMSRep.GridDataCustomerAccount(objGrdSettings);

                JsonResult result = Json(objJsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult CreateCustomerAccount()
        {
            try
            {

                spCustomerAccountManagement_Result objAccount = new spCustomerAccountManagement_Result();


                ViewBag.IsUpdate = false;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_ManageAccount", objAccount)
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
        public JsonResult EditTankCustomerAccount(int iCustomerAccountId)
        {
            try
            {


                spCustomerAccountManagement_Result objAccount = objDMSRep.GetCustomerAccount(iCustomerAccountId);

                ViewBag.IsUpdate = true;

                if (objAccount == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_ManageAccount", objAccount),
                    model = objAccount
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
        public JsonResult CreateEditCustomerAccount(string viewModel, string sCommand)
        {
            int iCheck = -1;
            bool bResult = false;


            try
            {

                spCustomerAccountManagement_Result objAccount = JsonConvert.DeserializeObject<spCustomerAccountManagement_Result>(viewModel);


                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }
                if (sCommand == "Add")
                {


                    iCheck = objDMSRep.AddCustomerAccount(objAccount);


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

                    iCheck = objDMSRep.UpdateCustomerAccount(objAccount);

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
        public ActionResult DeleteCustomerAccount(int iCustomerAccountId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objDMSRep.DeleteCustomerAccount(iCustomerAccountId);

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

        #region Tank Master

        public ActionResult TankMaster()
        {
            return View("TankMaster");
        }

        public ActionResult GridDataTankMaster(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objDMSRep.GridDataTankMaster(objGrdSettings);

                JsonResult result = Json(objJsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult CreateTankMaster()
        {
            try
            {
                spTankMasterManagement_Result objTank = new spTankMasterManagement_Result();
                ViewBag.IsUpdate = false;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_TankMaster", objTank)
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
        public JsonResult EditTankMasterId(int iTankId)
        {
            try
            {
                spTankMasterManagement_Result objTank = new spTankMasterManagement_Result();
                string sResult = objDMSRep.GetTankMaster(iTankId);
                ViewBag.IsUpdate = true;

                if (objTank == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_TankMaster", objTank),
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
        public JsonResult CreateEditTankMaster(string viewModel, string sCommand)
        {
            int iCheck = -1;
            try
            {
                spTankMasterManagement_Result objTank = JsonConvert.DeserializeObject<spTankMasterManagement_Result>(viewModel);

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }
                if (sCommand == "Add")
                {

                    iCheck = objDMSRep.AddTankMaster(objTank);

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

                    iCheck = objDMSRep.UpdateTankMaster(objTank);

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
        public ActionResult DeleteTankMaster(string iTankId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objDMSRep.DeleteTankMaster(iTankId);

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
        public void ExportTankMaster(string model)
        {
            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    objDMSRep.ExportTankMaster(exportModel);
            }
            catch (Exception Ex)
            {
            }


        }

        public string PrintTankMaster(string model)
        {

            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    return objDMSRep.PrintTankMaster(exportModel);
            }
            catch (Exception Ex)
            {
            }
            return "";
        }
        #endregion

        #region Tank CLLI Code

        public ActionResult CLLICode()
        {
            return View("CLLICode");
        }

        public ActionResult GridDataCLLICode(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objDMSRep.GridDataCLLICode(objGrdSettings);

                JsonResult result = Json(objJsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult CreateCLLICode()
        {
            try
            {
                spCLLICodeManagement2_Result objTank = new spCLLICodeManagement2_Result();
                ViewBag.IsUpdate = false;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_CLLICode", objTank)
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
        public JsonResult EditCLLICodeId(int iId)
        {
            try
            {
                spCLLICodeManagement2_Result objTank = new spCLLICodeManagement2_Result();
                string sResult = objDMSRep.GetCLLICode(iId);
                ViewBag.IsUpdate = true;

                if (objTank == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_CLLICode", objTank),
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
        public JsonResult CreateEditCLLICode(string viewModel, string sCommand)
        {
            int iCheck = -1;
            try
            {
                spCLLICodeManagement2_Result objClliCode = JsonConvert.DeserializeObject<spCLLICodeManagement2_Result>(viewModel);

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }
                if (sCommand == "Add")
                {

                    iCheck = objDMSRep.AddCLLICode(objClliCode);

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

                    iCheck = objDMSRep.UpdateCLLICode(objClliCode);

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
        public ActionResult DeleteCLLICode(string sIds)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objDMSRep.DeleteCLLICode(sIds);

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
        public void ExportCLLICode(string model)
        {
            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    objDMSRep.ExportCLLICode(exportModel);
            }
            catch (Exception Ex)
            {
            }


        }

        public string PrintCLLICode(string model)
        {

            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    return objDMSRep.PrintCLLICode(exportModel);
            }
            catch (Exception Ex)
            {
            }
            return "";
        }
        #endregion

        #region Tank Page - Main Page
        public ViewResult Tank()
        {
            //for menu selection - show current menu
            Session["MenuUrl"] = "/DMS/DMS/Tank";

            //menu selection - hide previous active menu
            Session["MenuId"] = "";

            //menu selection - hide previous active page
            Session["PageId"] = "";

            return View("Tank", new TankModel());
        }

        public JsonResult DrawTank(string viewModel)
        {
            try
            {
                TankModel objTank = JsonConvert.DeserializeObject<TankModel>(viewModel);
                List<GetAllTanksMainPage_Result> objTankList = objDMSRep.GetAllTanksMainPage(ref objTank);

                //assign session values
                ((SiteSession)HttpContext.Session["SiteSession"]).GroupID = objTank.GroupId.ToString();
                ((SiteSession)HttpContext.Session["SiteSession"]).AccountID = objTank.AccountId;

                if (objTankList == null)
                    return null;

                ViewBag.PageCount = objTankList.Count;
                ViewBag.PageIndex = objTank.PageIndex;
                ViewBag.PageSize = objTank.PageSize;
                //ViewBag.Row = objTank.Row;
                ViewBag.Row =(int)Math.Ceiling(objTankList.Count / Convert.ToDecimal(objTank.Column));
                
                if (objTankList.Count <= objTank.Column)
                    ViewBag.Column = objTankList.Count;
                else
                    ViewBag.Column = objTank.Column;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("DrawTank", objTankList),
                    pagesize = objTank.PageSize,
                    totalrow =  Math.Ceiling(objTank.PageCount / (objTank.PageSize * 1.0)) * objTank.PageSize
                };

                if (Request.IsAjaxRequest())
                {
                    return Json(jsonResult, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        public JsonResult DrawMap(string viewModel)
        {
            try
            {
                TankModel objTank = JsonConvert.DeserializeObject<TankModel>(viewModel);
                List<GetAllTanksMainPage_Result> objTankList = objDMSRep.GetAllTanksMainPage(ref objTank);

                //assign session values
                ((SiteSession)HttpContext.Session["SiteSession"]).GroupID = objTank.GroupId.ToString();
                ((SiteSession)HttpContext.Session["SiteSession"]).AccountID = objTank.AccountId;

                if (objTankList == null)
                    return null;

                List<MapPoints> points = new List<MapPoints>();

                foreach (GetAllTanksMainPage_Result res in objTankList)
                {

                    MapPoints point = new MapPoints();

                    if (res.CurrentLatitude != null && res.CurrentLongitude != null)
                    {

                        point.CurrentLatitude = res.CurrentLatitude.ToString();
                        point.CurrentLongitude = res.CurrentLongitude.ToString();
                        point.TankID = res.TankID.ToString();

                        point.IsTab = true;

                        if (res.IsMAX != null)
                            point.IconID = res.IsMAX.ToString();


                        if (res.TankDipQty != null && res.ReorderLevel != null)
                            point.IconID = "2";


                        point.BoundLat1 = res.TankID.ToString();

                        point.IconName = res.IconName;

                        //Tank Info

                        TankInformation tankInfo = new TankInformation();

                        if (res.TankName != null)
                            tankInfo.TankName = res.TankName;

                        if (res.Tankcapacity != 0)
                            tankInfo.TankCapacity = res.Tankcapacity.ToString();

                        if (res.TankDipQty != null)
                            tankInfo.CurrentQuantity = res.TankDipQty.ToString();

                        if (res.ReOrder != null)
                            tankInfo.ReOrderLevel = res.ReOrder.ToString();

                        if (res.TankProduct != null)
                            tankInfo.Product = res.TankProduct;


                        point.tankInfo = tankInfo;


                        //Tank Address Info
                        TankAddress address = new TankAddress();

                        if (res.PhysicalAddress != null)
                            address.Street = res.PhysicalAddress;

                        if (res.City != null)
                            address.City = res.City;

                        if (res.State != null)
                            address.State = res.State;

                        if (res.Zip != null)
                            address.Zip = res.Zip;

                        point.tankAddress = address;

                        points.Add(point);

                    }
                }
                var jsonResult = new
                {
                    view = points,
                    pagesize = objTank.PageSize,
                    totalrow = Math.Ceiling(objTank.PageCount / (objTank.PageSize * 1.0)) * objTank.PageSize
                };

                return Json(jsonResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        public ViewResult TankDetails(int iTankID)
        {
            if (((SiteSession)HttpContext.Session["SiteSession"]) != null)
                ((SiteSession)HttpContext.Session["SiteSession"]).TankId = iTankID;

            return View();
        }

        public ActionResult GenerateImage(decimal Percentage, decimal ReorderLevel)
        {
            //Response.ContentType = "image/JPEG";
            FileContentResult result;

            //Percentage = 50;
            Percentage = Math.Round(Percentage, 2);
            ReorderLevel = Math.Round(ReorderLevel, 2);

            string FuelImage = "Green_Fuel.png";

            if (Percentage <= ReorderLevel)
                FuelImage = "Red_tank.png";


            System.Drawing.Image objA = System.Drawing.Image.FromFile(Server.MapPath(Url.Content("~/Images/")) + "\\greynew.png");
            System.Drawing.Image objB = System.Drawing.Image.FromFile(Server.MapPath(Url.Content("~/Images/")) + "\\" + FuelImage);
            System.Drawing.Image objC = System.Drawing.Image.FromFile(Server.MapPath(Url.Content("~/Images/")) + "\\greynew.png");
            System.Drawing.Image objD = System.Drawing.Image.FromFile(Server.MapPath(Url.Content("~/Images/")) + "\\Outer2.png");

            System.Drawing.Graphics myGraphic = System.Drawing.Graphics.FromImage(objC);

            decimal currHeight = objA.Height;
            decimal AHeight = (currHeight / 100) * Percentage;
            decimal newHeight = currHeight - AHeight;


            myGraphic.DrawImageUnscaled(objA, 0, 0);
            myGraphic.DrawImageUnscaled(objB, 0, Convert.ToInt32(newHeight));


            Font objNewFont = new Font("Arial", objA.Height / 12, FontStyle.Bold);

            Pen objPen = new Pen(Brushes.Snow);

            if (Percentage > ReorderLevel)
                objPen.Color = Color.Black; // need to be removed

            objPen.DashStyle = DashStyle.Dot;

            decimal AReOrderHeight = (currHeight / 100) * ReorderLevel;
            decimal newReOrderHeight = currHeight - AReOrderHeight;

            myGraphic.DrawLine(objPen, 0, Convert.ToInt32(newReOrderHeight), objA.Width, Convert.ToInt32(newReOrderHeight));

            //myGraphic.DrawImageUnscaled(objD, 0, 0);
            myGraphic.Save();
            Bitmap first = new Bitmap(objC);
            Bitmap second = new Bitmap(objD);
            Bitmap finalImg = new Bitmap(first.Width, first.Height);
            Graphics g = Graphics.FromImage(finalImg);
            g.DrawImageUnscaled(first, 0, 0);
            g.Flush();
            g.DrawImageUnscaled(second, 0, 0);
            g.Flush();
            //result.Save(Response.OutputStream, System.Drawing.Imaging.ImageFormat.Png);

            using (var memStream = new System.IO.MemoryStream())
            {
                finalImg.Save(memStream, System.Drawing.Imaging.ImageFormat.Png);
                result = this.File(memStream.GetBuffer(), "image/Png");
            }

            return result;
        }

        public ActionResult GenerateImageForTankStatus(decimal Percentage, decimal ReorderLevel)
        {
            //Response.ContentType = "image/JPEG";
            FileContentResult result;

            //Percentage = 50;
            Percentage = Math.Round(Percentage, 2);
            ReorderLevel = Math.Round(ReorderLevel, 2);

            string FuelImage = "Green_Fuel.png";

            if (Percentage <= ReorderLevel)
                FuelImage = "Red_tank.png";


            System.Drawing.Image objA = System.Drawing.Image.FromFile(Server.MapPath(Url.Content("~/Images/")) + "\\greynew.png");
            System.Drawing.Image objB = System.Drawing.Image.FromFile(Server.MapPath(Url.Content("~/Images/")) + "\\" + FuelImage);
            System.Drawing.Image objC = System.Drawing.Image.FromFile(Server.MapPath(Url.Content("~/Images/")) + "\\greynew.png");
            System.Drawing.Image objD = System.Drawing.Image.FromFile(Server.MapPath(Url.Content("~/Images/")) + "\\Outer3.png");

            System.Drawing.Graphics myGraphic = System.Drawing.Graphics.FromImage(objC);

            decimal currHeight = objA.Height;
            decimal AHeight = (currHeight / 100) * Percentage;
            decimal newHeight = currHeight - AHeight;


            myGraphic.DrawImageUnscaled(objA, 0, 0);
            myGraphic.DrawImageUnscaled(objB, 0, Convert.ToInt32(newHeight));


            Font objNewFont = new Font("Arial", objA.Height / 12, FontStyle.Bold);

            Pen objPen = new Pen(Brushes.Snow);

            if (Percentage > ReorderLevel)
                objPen.Color = Color.Black; // need to be removed

            objPen.DashStyle = DashStyle.Dot;

            decimal AReOrderHeight = (currHeight / 100) * ReorderLevel;
            decimal newReOrderHeight = currHeight - AReOrderHeight;

            myGraphic.DrawLine(objPen, 0, Convert.ToInt32(newReOrderHeight), objA.Width, Convert.ToInt32(newReOrderHeight));

            //myGraphic.DrawImageUnscaled(objD, 0, 0);
            myGraphic.Save();
            Bitmap first = new Bitmap(objC);
            Bitmap second = new Bitmap(objD);
            Bitmap finalImg = new Bitmap(first.Width, first.Height);
            Graphics g = Graphics.FromImage(finalImg);
            g.DrawImageUnscaled(first, 0, 0);
            g.Flush();
            g.DrawImageUnscaled(second, 0, 0);
            g.Flush();
            //result.Save(Response.OutputStream, System.Drawing.Imaging.ImageFormat.Png);

            using (var memStream = new System.IO.MemoryStream())
            {
                finalImg.Save(memStream, System.Drawing.Imaging.ImageFormat.Png);
                result = this.File(memStream.GetBuffer(), "image/Png");
            }

            return result;
        }
        [HttpPost]
        public JsonResult TankLastOEEntries(int iTankId)
        {
            try
            {
                tblNewReOrderEntry objOEntry = objDMSRep.TankLastOEEntries(iTankId);

                if (objOEntry == null)
                    return null;

                return Json(objOEntry, JsonRequestBehavior.AllowGet);

            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        [HttpPost]
        public JsonResult CreateOEEntries(string sTankName, int iTankId, string sOrderQty, string sOrderDate)
        {
            int iCheck = -1;
            bool bResult = false;
            string sMsg = "";

            try
            {

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }
                {

                    iCheck = objDMSRep.CreateOEEntries(iTankId, sOrderQty, sOrderDate);
                    if (iCheck > 0)
                    {
                        sJsonResult = SUCCESS;
                        sJsonMsg = UPDATE_SUCCESS;

                        ModelState.Clear();
                        ViewData.Clear();

                        //SendMail 
                        sMsg = "<html><body><p><b>" + string.Format(" Tank {0} has been reordered to {1} Gallons", sTankName, sOrderQty.Replace("\"", "")) + "</b></p><body></html>";

                        //send mail - forget password
                        bResult = EmailHlp.SendHtmlMail(ConfigurationManager.AppSettings["mailFrom"].ToString(), ConfigurationManager.AppSettings["OEMailTo"].ToString(), sMsg, "Re-Order Entry", "", "", "");
                        //SendMail(System.Configuration.ConfigurationSettings.AppSettings["OEMailTo"].ToString(), sMsg);

                        if (!bResult)//if mail sending filed
                        {
                            sJsonResult = FAIL;
                            sJsonMsg = sJsonMsg + COMMA + MAIL_FAIL;
                        }
                        else
                        {
                            sJsonResult = SUCCESS;
                            sJsonMsg = sJsonMsg + COMMA + MAIL_SUCCESS;
                        }

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

        #endregion

        #region Bind Dropdown Methods
        [HttpPost]
        public MvcHtmlString BindSubGroup(int iGroupId)
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).GroupID = iGroupId.ToString();

            StringBuilder sbHtmlResult = new StringBuilder();
            sbHtmlResult.Append("<option value='0'>ALL</option>");

            DataTable dtCustomer = objDMSRep.BindSubGroup(iGroupId);

            foreach (DataRow row in dtCustomer.Rows)
            {
                sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
            }

            MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
            return objResult;
        }
        [HttpPost]
        public MvcHtmlString BindSite(string sAccount, string sOrderBy)
        {
            StringBuilder sbHtmlResult = new StringBuilder();
            //sbHtmlResult.Append("<option value=''>ALL</option>");

            DataTable dtCustomer = objDMSRep.BindSite(sAccount, sOrderBy);

            foreach (DataRow row in dtCustomer.Rows)
            {
                sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
            }

            MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
            return objResult;
        }
       
        #endregion

        #region Tank Status
        public ViewResult TankStatus()
        {
            try
            {
                GetTankDetailsByTankID_Result objTankDetails = new GetTankDetailsByTankID_Result();
                objTankDetails = objDMSRep.EditTankDetailsByTankID();

                if (objTankDetails == null)
                    return null;

                return View("TankStatus", objTankDetails);
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult TankStatusTab()
        {
            try
            {
                GetTankDetailsByTankID_Result objTankDetails = new GetTankDetailsByTankID_Result();
                objTankDetails = objDMSRep.EditTankDetailsByTankID();

                if (objTankDetails == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("TankStatus", objTankDetails)
                };

                if (Request.IsAjaxRequest())
                {

                    return Json(jsonResult, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult SaveTankStatus(string viewModel)
        {
            int iCheck = -1;
            try
            {
                GetTankDetailsByTankID_Result objTankStatus = JsonConvert.DeserializeObject<GetTankDetailsByTankID_Result>(viewModel);

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }

                iCheck = objDMSRep.SaveTankStatus(objTankStatus);
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

        #endregion

        #region Tank Data
        public ActionResult TankData()
        {
            return View();
        }
        [HttpPost]
        public JsonResult TankDataTab()
        {
            try
            {
                var jsonResult = new
                {
                    view = RenderPartialViewToString("TankData")
                };

                if (Request.IsAjaxRequest())
                {

                    return Json(jsonResult, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        public ActionResult GridDataTankData(GridSettings objGrdSettings, string sFromDate, string sToDate)
        {
            try
            {
                object objJsonResult = objDMSRep.GridDataTankData(objGrdSettings, sFromDate, sToDate);
                return Json(objJsonResult, JsonRequestBehavior.AllowGet);

            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        #endregion

        #region Show Map
        public ActionResult ShowMap()
        {
            return View();
        }
        [HttpPost]
        public JsonResult ShowMapTab()
        {
            try
            {
                var jsonResult = new
                {
                    view = RenderPartialViewToString("ShowMap")
                };

                if (Request.IsAjaxRequest())
                {
                    return Json(jsonResult, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }


        public ActionResult TankMap()
        {
            return View();
        }

        public JsonResult GetTankMap()
        {
            List<MapPoints> points = objDMSRep.GetTankMap();
            return Json(points, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetTankMapTab()
        {
            try
            {

                var jsonResult = new
                {
                    view = RenderPartialViewToString("TankMap")
                };

                if (Request.IsAjaxRequest())
                {

                    return Json(jsonResult, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        #endregion

        #region Tank Event
        public ActionResult TankEvent()
        {
            return View();
        }
        [HttpPost]
        public JsonResult TankEventTab()
        {
            try
            {
                var jsonResult = new
                {
                    view = RenderPartialViewToString("TankEvent")
                };

                if (Request.IsAjaxRequest())
                {

                    return Json(jsonResult, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        public ActionResult GridDataTankEvent(GridSettings objGrdSettings, string sFromDate, string sToDate)
        {
            try
            {
                object objJsonResult = objDMSRep.GridDataTankEvent(objGrdSettings, sFromDate, sToDate);
                return Json(objJsonResult, JsonRequestBehavior.AllowGet);

            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        #endregion

        #region Tank Contact
        public ActionResult TankContact()
        {
            try
            {
                TankContact objTankContact = objDMSRep.EditTankContact();

                if (objTankContact == null)
                    return null;

                return View("TankContact", objTankContact);
            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        [HttpPost]
        public JsonResult TankContactTab()
        {
            try
            {
                TankContact objTankContact = objDMSRep.EditTankContact();

                if (objTankContact == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("TankContact", objTankContact)
                };

                if (Request.IsAjaxRequest())
                {

                    return Json(jsonResult, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }


        [HttpPost]
        public JsonResult SaveTankContact(string viewModel)
        {
            int iCheck = -1;
            try
            {

                TankContact objTankContact = JsonConvert.DeserializeObject<TankContact>(viewModel);

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }

                iCheck = objDMSRep.SaveTankContact(objTankContact);
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
        #endregion

        #region Tank Location
        public ActionResult TankLocation()
        {
            try
            {
                TankLocation objTankLocation = objDMSRep.EditTankLocation();

                if (objTankLocation == null)
                    return null;
                return View("TankLocation", objTankLocation);
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult TankLocationTab()
        {
            try
            {
                TankLocation objTankLocation = objDMSRep.EditTankLocation();

                if (objTankLocation == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("TankLocation", objTankLocation)
                };

                if (Request.IsAjaxRequest())
                {

                    return Json(jsonResult, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public ActionResult SaveTankLocation(string viewModel)
        {
            int iCheck = -1;
            try
            {
                TankLocation objTankLocation = JsonConvert.DeserializeObject<TankLocation>(viewModel);
                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }

                iCheck = objDMSRep.SaveTankLocation(objTankLocation);
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
        #endregion

        #region Tank Alarm
        public ViewResult TankAlarm()
        {
            try
            {
                TankAlarm objTankAlarm = new TankAlarm();
                objTankAlarm = objDMSRep.EditTankAlarm();

                if (objTankAlarm == null)
                    return null;

                return View("TankAlarm", objTankAlarm);
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult TankAlarmTab()
        {
            try
            {
                TankAlarm objTankAlarm = new TankAlarm();
                objTankAlarm = objDMSRep.EditTankAlarm();

                if (objTankAlarm == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("TankAlarm", objTankAlarm)
                };

                if (Request.IsAjaxRequest())
                {

                    return Json(jsonResult, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult SaveTankAlarm(string viewModel)
        {
            int iCheck = -1;
            try
            {
                TankAlarm objTankAlarm = JsonConvert.DeserializeObject<TankAlarm>(viewModel);

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }

                iCheck = objDMSRep.SaveTankAlarm(objTankAlarm);
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
        #endregion

        #region Tank OE Default
        public ViewResult TankOE()
        {
            try
            {
                spGetTankOEDetailByTankID_Result objTankOE = new spGetTankOEDetailByTankID_Result();

                return View("TankOE", objTankOE);
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult TankOETab()
        {
            try
            {
                spGetTankOEDetailByTankID_Result objTankOE = objDMSRep.EditTankOE();

                if (objTankOE == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("TankOE", objTankOE)
                };

                if (Request.IsAjaxRequest())
                {
                    return Json(jsonResult, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult SaveTankOE(string viewModel)
        {
            int iCheck = -1;
            try
            {
                spGetTankOEDetailByTankID_Result objTankOE = JsonConvert.DeserializeObject<spGetTankOEDetailByTankID_Result>(viewModel);

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }

                iCheck = objDMSRep.SaveTankOE(objTankOE);
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
        #endregion

        #region Tank Manual Reading
        public ActionResult TankManualReading()
        {
            return View("TankManualReading", new ManualDipReading());
        }

        [HttpPost]
        public JsonResult TankManualReadingTab()
        {
            try
            {
                var jsonResult = new
                {
                    view = RenderPartialViewToString("TankManualReading", new ManualDipReading())
                };

                if (Request.IsAjaxRequest())
                {

                    return Json(jsonResult, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public ActionResult DeleteManualReading(int iManualDipReadingID)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objDMSRep.DeleteManualReading(iManualDipReadingID);
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

        [HttpPost]
        public JsonResult EditManualReadingId(int iManualDipReadingID)
        {
            try
            {
                ManualDipReading objReading = objDMSRep.EditManualReadingId(iManualDipReadingID);
                ViewBag.IsUpdate = true;

                if (Request.IsAjaxRequest())
                {
                    return Json(objReading, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public ActionResult CreateEditManualReading(string viewModel, string sCommand)
        {
            int iCheck = -1;
            try
            {

                ManualDipReading objReading = JsonConvert.DeserializeObject<ManualDipReading>(viewModel);


                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;

                }
                if (sCommand == "Add")
                {
                    iCheck = objDMSRep.AddManualReading(objReading);
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
                    iCheck = objDMSRep.UpdateManualReading(objReading);
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

        public ActionResult GridDataManualReading(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objDMSRep.GridDataManualReading(objGrdSettings);
                return Json(objJsonResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        #endregion

        #region Tank Comment
        public ViewResult TankComment()
        {
            return View("TankComment", new TankComment());
        }
        [HttpPost]
        public JsonResult TankCommentTab()
        {
            try
            {
                var jsonResult = new
                {
                    view = RenderPartialViewToString("TankComment", new TankComment())
                };

                if (Request.IsAjaxRequest())
                {

                    return Json(jsonResult, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public ActionResult DeleteTankComment(int iTankCommentID)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objDMSRep.DeleteTankComment(iTankCommentID);
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

        [HttpPost]
        public JsonResult EditTankCommentId(int iTankCommentID)
        {
            try
            {
                TankComment objComment = objDMSRep.EditTankCommentId(iTankCommentID);
                ViewBag.IsUpdate = true;

                if (Request.IsAjaxRequest())
                {
                    return Json(objComment, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public ActionResult CreateEditTankComment(string viewModel, string sCommand)
        {
            int iCheck = -1;
            try
            {
                TankComment objComment = JsonConvert.DeserializeObject<TankComment>(viewModel);



                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;

                }
                if (sCommand == "Add")
                {


                    iCheck = objDMSRep.AddTankComment(objComment);
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
                    iCheck = objDMSRep.UpdateTankComment(objComment);
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

        public ActionResult GridDataTankComment(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objDMSRep.GridDataTankComment(objGrdSettings);
                return Json(objJsonResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        #endregion

        #region Tank Reorder by Mile
        public ViewResult ReorderByMile(int iTankID)
        {
            if (((SiteSession)HttpContext.Session["SiteSession"]) != null)
                ((SiteSession)HttpContext.Session["SiteSession"]).TankId = iTankID;

            return View();
        }

        public ActionResult GridDataTankReorder(GridSettings objGrdSettings, string tankIds)
        {
            try
            {
                if (tankIds != null)
                {
                    object objJsonResult = objDMSRep.GridDataTankReorder(objGrdSettings, tankIds);

                    JsonResult result = Json(objJsonResult, JsonRequestBehavior.AllowGet);
                    return result;
                }
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        public ActionResult GetTankMiles(string sAccountID, int iTankId)
        {
            try
            {
                List<TankDetails> tankDetail = objDMSRep.GetTankMiles(sAccountID, iTankId);
                return Json(tankDetail, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        [HttpPost]
        public JsonResult SaveDeliveryCollection(DeliveryCollectionModel model)
        {
            int iCheck = -1;
            try
            {
                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;

                }

                iCheck = objDMSRep.SaveDeliveryCollection(model);
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
            catch (Exception Ex)
            {
            }
            return jSONResult;
        }
        [HttpPost]
        public ActionResult DeleteTankReorder(int iTankId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objDMSRep.DeleteTankReorder(iTankId);
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

        #region Tank Reorder by ETR
        public ViewResult ReorderByETRandETE(int iTankID)
        {
            if (((SiteSession)HttpContext.Session["SiteSession"]) != null)
                ((SiteSession)HttpContext.Session["SiteSession"]).TankId = iTankID;

            //initialise the caching
            Session["TankReorderByETRandETE"] = null;

            return View();
        }
        public ActionResult GridDataTankReorderByETR(GridSettings objGrdSettings, short sType, short sAvg, int iDay1, int iDay2)
        {
            try
            {
                //sType  = 1 - ETR
                //      = 2 - ETE          
                object objJsonResult = objDMSRep.GridDataTankReorderByETR(objGrdSettings, sType, sAvg, iDay1, iDay2);
                JsonResult result = Json(objJsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        [HttpPost]
        public ActionResult DeleteTankReorderByETRandETE(int iTankId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objDMSRep.DeleteTankReorderByETRandETE(iTankId);
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
    }
}