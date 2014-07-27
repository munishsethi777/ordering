using System;
using System.Web.Mvc;
using MvcJqGrid;
using Newtonsoft.Json;
using MVCDataModel;
using MVCBusinessModel.Abstract.Admin;
using System.Configuration;
using MVCBusinessModel.Mail;

namespace MVCEF.Areas.Admin.Controllers
{
    public class AdminController : MyBaseController
    {
        private IAdminRepository objAdminRepository = null;
        SiteSession siteSession = null;

        public AdminController(IAdminRepository objRepository)
        {
            objAdminRepository = objRepository;
        }

        public ActionResult Index()
        {
            return View("Index");
        }

        #region Menu Controller Actions
        //
        // GET: /Admin/Menu/
        public ActionResult Menu()
        {
            return View("Menu");
        }
        /// <summary>
        /// AJAX request, retrieves data for basic grid
        /// </summary>
        /// <param name="gridSettings">Settings received from jqGrid request</param>
        /// <returns>JSON view containing data for basic grid</returns>
        public ActionResult GridDataMenu(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objAdminRepository.GridDataMenu(objGrdSettings);
                return Json(objJsonResult, JsonRequestBehavior.AllowGet);

            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult CreateMenu()
        {
            try
            {
                tblMenu objMenu = new tblMenu();
                ViewBag.IsUpdate = false;
                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Menu", objMenu)
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
        public ActionResult DeleteMenu(string iMenuId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objAdminRepository.DeleteMenu(iMenuId);
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
        public JsonResult EditMenuId(int iMenuId)
        {
            try
            {



                tblMenu objMenu = objAdminRepository.GetMenu(iMenuId);

                ViewBag.IsUpdate = true;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Menu", objMenu),
                    model = objMenu
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
        public ActionResult CreateEditMenu(string viewModel, string sCommand)
        {
            int iCheck = -1;
            try
            {

                tblMenu objMenu = JsonConvert.DeserializeObject<tblMenu>(viewModel);
                objMenu.UserId = 1;
                objMenu.CreatedDate = DateTime.Now;
                objMenu.LastChangeDate = DateTime.Now;

                //Do Something with your entity/class
                // Validate the model being submitted

                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;

                }
                if (sCommand == "Add")
                {
                    iCheck = objAdminRepository.AddMenu(objMenu);
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
                    iCheck = objAdminRepository.UpdateMenu(objMenu);
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

        public void ExportMenu(string model)
        {

            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    objAdminRepository.ExportMenu(exportModel);
            }
            catch (Exception Ex)
            {
            }



        }

        public string PrintMenu(string model)
        {
            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    return objAdminRepository.PrintMenu(exportModel);
            }
            catch (Exception Ex)
            {
            }
            return "";


        }
        #endregion

        #region Group Controller Actions
        public ActionResult Group()
        {

            return View("Group");
        }

        [HttpPost]
        public JsonResult CreateGroup()
        {
            try
            {
                tblGroup objGroup = new tblGroup();
                ViewBag.IsUpdate = false;
                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Group", objGroup)
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
            return null;
        }

        [HttpPost]
        public ActionResult DeleteGroup(string iGroupId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objAdminRepository.DeleteGroup(iGroupId);
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
        public JsonResult EditGroupId(int iGroupId)
        {
            try
            {
                tblGroup objGroup = objAdminRepository.GetGroup(iGroupId);
                ViewBag.IsUpdate = true;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Group", objGroup),
                    model = objGroup
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
        public ActionResult CreateEditGroup(string viewModel, string sCommand)
        {
            int iCheck = -1;
            try
            {
                tblGroup objGroup = JsonConvert.DeserializeObject<tblGroup>(viewModel);
                objGroup.UserId = 1;
                objGroup.CreatedDate = DateTime.Now;
                objGroup.LastChangeDate = DateTime.Now;

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;

                }
                if (sCommand == "Add")
                {
                    iCheck = objAdminRepository.AddGroup(objGroup);
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
                    iCheck = objAdminRepository.UpdateGroup(objGroup);
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

        public ActionResult GridDataGroup(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objAdminRepository.GridDataGroup(objGrdSettings);
                return Json(objJsonResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        public void ExportGroupMaster(string model)
        {

            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    objAdminRepository.ExportGroupMaster(exportModel);
            }
            catch (Exception Ex)
            {
            }


        }

        public string PrintGroupMaster(string model)
        {
            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    return objAdminRepository.PrintGroupMaster(exportModel);
            }
            catch (Exception Ex)
            {
            }
            return "";



        }
        #endregion

        #region Page Controller Actions
        public ActionResult Page()
        {
            return View("Page");
        }

        [HttpPost]
        public JsonResult GetPage(int iPageId)
        {
            var objPage = objAdminRepository.GetPage(iPageId);

            if (Request.IsAjaxRequest())
            {
                return Json(objPage, JsonRequestBehavior.AllowGet);
            }
            return null;
        }

        [HttpPost]
        public JsonResult CreatePage()
        {
            try
            {
                tblPage objPage = new tblPage();
                ViewBag.IsUpdate = false;
                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Page", objPage)
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
        public ActionResult DeletePage(int iPageId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objAdminRepository.DeletePage(iPageId);
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
        public JsonResult EditPageId(int iPageId)
        {
            try
            {
                tblPage objPage = objAdminRepository.GetPage(iPageId);
                ViewBag.IsUpdate = true;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Page", objPage),
                    model = objPage
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
        public ActionResult CreateEditPage(string viewModel, string sCommand)
        {
            int iCheck = -1;
            try
            {
                tblPage objPage = JsonConvert.DeserializeObject<tblPage>(viewModel);
                objPage.UserId = 1;
                objPage.CreatedDate = DateTime.Now;
                objPage.LastChangeDate = DateTime.Now;

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;

                }
                if (sCommand == "Add")
                {
                    iCheck = objAdminRepository.AddPage(objPage);
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
                    iCheck = objAdminRepository.UpdatePage(objPage);
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

        public ActionResult GridDataPage(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objAdminRepository.GridDataPage(objGrdSettings);
                return Json(objJsonResult, JsonRequestBehavior.AllowGet);

            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        #endregion

        #region Menu Page Controller Actions
        public ActionResult MenuPage()
        {
            return View("MenuPage");
        }

        [HttpPost]
        public JsonResult CreateMenuPage()
        {
            try
            {
                tblMenuPage objMenuPage = new tblMenuPage();
                ViewBag.IsUpdate = false;
                var jsonResult = new
                {
                    view = RenderPartialViewToString("_MenuPage", objMenuPage)
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
        public ActionResult DeleteMenuPage(string iMenuPageId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objAdminRepository.DeleteMenuPage(iMenuPageId);
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
        public JsonResult EditMenuPageId(int iMenuPageId)
        {
            try
            {
                tblMenuPage objMenuPage = objAdminRepository.GetMenuPage(iMenuPageId);
                ViewBag.IsUpdate = true;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_MenuPage", objMenuPage),
                    model = objMenuPage
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
        public ActionResult CreateEditMenuPage(string viewModel, string sCommand)
        {
            int iCheck = -1;
            try
            {
                tblMenuPage objMenuPage = JsonConvert.DeserializeObject<tblMenuPage>(viewModel);
                objMenuPage.UserId = 1;
                objMenuPage.CreatedDate = DateTime.Now;
                objMenuPage.LastChangeDate = DateTime.Now;

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;

                }
                if (sCommand == "Add")
                {
                    iCheck = objAdminRepository.AddMenuPage(objMenuPage);
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
                    iCheck = objAdminRepository.UpdateMenuPage(objMenuPage);
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

        public ActionResult GridDataMenuPage(GridSettings objGrdSettings, bool bExport = false)
        {
            try
            {
                object objJsonResult = objAdminRepository.GridDataMenuPage(objGrdSettings);
                return Json(objJsonResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
            }
            return null;

        }
        public ActionResult GridDataMenuPageExport(GridSettings objGrdSettings, bool bExport = false)
        {
            try
            {
                object objJsonResult = objAdminRepository.GridDataMenuPage(objGrdSettings);
                return Json(objJsonResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
            }
            return null;

        }
        public void ExportMenuPage(string model)
        {
            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    objAdminRepository.ExportMenuPage(exportModel);
            }
            catch (Exception Ex)
            {
            }


        }

        public string PrintMenuPage(string model)
        {

            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    return objAdminRepository.PrintMenuPage(exportModel);
            }
            catch (Exception Ex)
            {
            }
            return "";

           

        }
        #endregion

        #region Permission Controller Actions
        public ActionResult Permission()
        {
            return View();
        }
        [HttpPost]
        public JsonResult GetMenuPagePermission(int iCustomerId, int iRoleId)
        {

            var objResult = objAdminRepository.GetMenuPagePermission(iCustomerId, iRoleId);

            if (Request.IsAjaxRequest())
            {
                return Json(objResult, JsonRequestBehavior.AllowGet);
            }
            return null;
        }
        public ActionResult GridDataMenuPagePermission(GridSettings objGrdSettings, int iCustomerId, int iRoleId, string sMenuId)
        {
            try
            {
                object objJsonResult = objAdminRepository.GridDataMenuPagePermission(objGrdSettings, iCustomerId, iRoleId, sMenuId);
                return Json(objJsonResult, JsonRequestBehavior.AllowGet);

            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        public int UpdateMenuPagePermission(int iCustomerId, int iRoleId, string sMenuId, string sPageId)
        {
            int iResult = objAdminRepository.UpdateMenuPagePermission(iCustomerId, iRoleId, sMenuId, sPageId);
            return iResult;
        }
        #endregion

        #region Role Controller Actions
        public ActionResult Role()
        {
            return View("Role");
        }

        [HttpPost]
        public JsonResult CreateRole()
        {
            try
            {
                tblrole objRole = new tblrole();
                ViewBag.IsUpdate = false;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Role", objRole)
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
        public ActionResult DeleteRole(string iRoleId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objAdminRepository.DeleteRole(iRoleId);
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
        public JsonResult EditRoleId(int iRoleId)
        {
            try
            {
                tblrole objRole = objAdminRepository.GetRole(iRoleId);
                ViewBag.IsUpdate = true;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_Role", objRole),
                    model = objRole
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
        public ActionResult CreateEditRole(string viewModel, string sCommand)
        {
            int iCheck = -1;
            try
            {
                tblrole objRole = JsonConvert.DeserializeObject<tblrole>(viewModel);
                objRole.CreatedBy = 1;
                objRole.CreatedDate = DateTime.Now;
                objRole.ModifiedDate = DateTime.Now;

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;

                }
                if (sCommand == "Add")
                {
                    iCheck = objAdminRepository.AddRole(objRole);
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
                    iCheck = objAdminRepository.UpdateRole(objRole);
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

        public ActionResult GridDataRole(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objAdminRepository.GridDataRole(objGrdSettings);
                return Json(objJsonResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        public void ExportRoles(string model)
        {

            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    objAdminRepository.ExportRoles(exportModel);
            }
            catch (Exception Ex)
            {
            }


        }

        public string PrintRoles(string model)
        {

            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    return objAdminRepository.PrintRoles(exportModel);
            }
            catch (Exception Ex)
            {
            }
            return "";


        }
        #endregion

        #region User Controller Actions
        public ActionResult WebUser()
        {
            return View("WebUser");
        }

        public ActionResult GridDataWebUser(GridSettings objGrdSettings)
        {
            try
            {
                object objJsonResult = objAdminRepository.GridDataWebUser(objGrdSettings);
                return Json(objJsonResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
            }
            return null;
        }
        [HttpPost]
        public JsonResult CreateWebUser()
        {
            try
            {
                spUserManagement_Result objWebUser = new spUserManagement_Result();
                ViewBag.IsUpdate = false;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_WebUser", objWebUser)
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
        public JsonResult EditWebUserId(int iWebUserId)
        {
            try
            {
                spUserManagement_Result objWebUser = objAdminRepository.GetWebUser(iWebUserId);
                ViewBag.IsUpdate = true;

                if (objWebUser == null)
                    return null;

                var jsonResult = new
                {
                    view = RenderPartialViewToString("_WebUser", objWebUser),
                    model = objWebUser
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
        public JsonResult CreateEditWebUser(string viewModel, string sCommand)
        {
            int iCheck = -1;
            bool bResult = false;
            string sPassword = "", sMsg = "";

            try
            {

                spUserManagement_Result objWebUser = JsonConvert.DeserializeObject<spUserManagement_Result>(viewModel);

                // Validate the model being submitted
                if (!ModelState.IsValid)
                {
                    sJsonResult = FAIL;
                    sJsonMsg = SERVER_VALIDATION_FAILED;
                    return jSONResult;
                }
                if (sCommand == "Add")
                {
                    sPassword = PasswordHelper.GeneratePassword(6, 10);
                    objWebUser.password = PasswordHelper.HashEncrypt(sPassword);

                    iCheck = objAdminRepository.AddWebUser(objWebUser);
                    if (iCheck > 0)
                    {
                        sJsonResult = SUCCESS;
                        sJsonMsg = ADD_SUCCESS;

                        ModelState.Clear();
                        ViewData.Clear();

                        //SendMail - password and mailto to registerd id
                        ViewData["Password"] = sPassword;
                        ViewData["MailTo"] = objWebUser.emailaddress;

                        sMsg = RenderPartialViewToString("MailNewUser");

                        //send mail - forget password
                        bResult = EmailHlp.SendHtmlMail(ConfigurationManager.AppSettings["mailFrom"].ToString(), objWebUser.emailaddress, sMsg, "Dispatch Management Webuser Information", "", "", "");

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
                        sJsonMsg = ADD_FAIL;
                    }
                }
                if (sCommand == "Update")
                {
                    iCheck = objAdminRepository.UpdateWebUser(objWebUser);
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
        public ActionResult DeleteWebUser(string iWebUserId)
        {
            try
            {
                if (Request.IsAjaxRequest())
                {
                    int iCheck = objAdminRepository.DeleteWebUser(iWebUserId);
                    if (iCheck > 0)
                    {
                        sJsonResult = SUCCESS;
                        sJsonMsg = DEACTIVATED_SUCCESS;
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

        public void ExportWebUser(string model)
        {
            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    objAdminRepository.ExportWebUser(exportModel);
            }
            catch (Exception Ex)
            {
            }



        }

        public string PrintWebUser(string model)
        {


            try
            {
                ExportGridModel exportModel = null;
                if (model != null)
                    exportModel = JsonConvert.DeserializeObject<ExportGridModel>(model);

                if (exportModel != null)
                    return objAdminRepository.PrintWebUser(exportModel);
            }
            catch (Exception Ex)
            {
            }
            return "";


        }
        #endregion
    }
}
