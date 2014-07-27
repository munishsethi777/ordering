using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCDataModel;
using MVCBusinessModel.Abstract.Account;
using MVCBusinessModel.Mail;
using System.Configuration;
using MVCBusinessModel.Abstract.Menu;
using MVCBusinessModel.Concrete.Menu;

namespace MVCEF.Account.Controllers
{
    public class AccountController : MyBaseController
    {
        private IAccountRepository objAccountRep = null;
        private spGetUserByEmailId_Result objWebUser = null;


        public AccountController(IAccountRepository objRepository)
        {
            objAccountRep = objRepository;
        }

        //
        // GET: /Account/
        public ActionResult Login()
        {
            ViewData["ErrorMsg"] = "";
            //SiteSession siteSession = (SiteSession)Session["SiteSession"];
            if (Session["SiteSession"] != null)
            {
                SiteSession siteSession = (SiteSession)Session["SiteSession"];
                objAccountRep.OnUserLogoff(siteSession.VisitorLogID, true);
            }
            SiteSession.LogOff(this.Session);

            if (Session["UserName"] != null)
                Session[Session["UserName"].ToString()] = null; // to null severl attempt login value


            Session["SiteSession"] = null;
            Session["CustomerId"] = null;
            Session["UserName"] = null;
            Session["UserRole"] = null;
            Session["CustomerName"] = null;

            Session["EmailID"] = null;
            Session["RoleId"] = null;
            Session["UserId"] = null;
            Session["IsPseUser"] = null;
            Session["MenuUrl"] = "";
            Session["MenuId"] = "";
            Session["PageId"] = "";

            return View();
        }

        public ActionResult Logout()
        {
            ViewData["ErrorMsg"] = "";
            SiteSession siteSession = (SiteSession)Session["SiteSession"];
            if (siteSession != null)
                objAccountRep.OnUserLogoff(siteSession.VisitorLogID, true);
            SiteSession.LogOff(this.Session);

            if (Session["UserName"] != null)
                Session[Session["UserName"].ToString()] = null; // to null severl attempt login value


            Session["SiteSession"] = null;
            Session["CustomerId"] = null;
            Session["CustomerId"] = null;
            Session["UserName"] = null;
            Session["UserRole"] = null;
            Session["CustomerName"] = null;

            Session["EmailID"] = null;
            Session["RoleId"] = null;
            Session["UserId"] = null;
            Session["IsPseUser"] = null;
            Session["MenuUrl"] = "";
            Session["MenuId"] = "";
            Session["PageId"] = "";

            LoginModel model = new LoginModel();
            model.IsSessionExpired = true;
            return View("Login", model);

           
        }

        [HttpPost]
        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        public virtual ActionResult Login(string UserName, string Password, bool RememberMe)
        {
            string sEncPassword = "";
            string sExpMsg = "";
            bool IsExpiry = false;
            int iTimes = 0;
            ViewData["ErrorMsg"] = "";
            try
            {
                if (!ModelState.IsValid)
                {
                    ViewData["ErrorMsg"] = "Your login attempt was not successful. Please try again.";
                    return View();
                }

                ModelState.Clear();

                //get the user details by login email id
                objWebUser = objAccountRep.GetUserByEmailId(UserName);

                //check login mail id
                if (objWebUser == null)
                {
                    ViewData["ErrorMsg"] = "Please enter the registered EMail ID.";
                    return View();
                }


                //check the is active state
                if (objWebUser.isactive == false)
                {
                    ViewData["ErrorMsg"] = "Your login account is Locked.  Please contact administrator";
                    return View();

                }

                //if (objWebUser.passenctype == 1)
                    sEncPassword = PasswordHelper.HashEncrypt(Password);
                //else if (objWebUser.passenctype == 2)
                //    sEncPassword = PasswordHelper.Encrypt(Password);
                //else
                //    sEncPassword = Password;

                // alert user for password expiry from 7 days before of expiration
                // if the expirationdate is current inform user to contact adminstrator and disable the user
                tblUserPassword objUserExp = objAccountRep.GetUserPasswordExpiry(objWebUser.userid, sEncPassword);

                if (objUserExp != null && objWebUser.roleid != 2 && objUserExp.ExpiryDate != null)
                {
                    //Password expiry on ExpiryDate so subract one day
                    TimeSpan diff = objUserExp.ExpiryDate.Value.Date.Subtract(DateTime.Now.Date);
                    if (diff.Days > 0 && diff.Days <= 7)
                    {
                        sExpMsg = "Your password will expiry within " + diff.Days + " days, please change your password.";
                        ViewData["ErrorMsg"] = sExpMsg;
                        return View();
                    }

                    if (diff.Days <= 0) //Disable user
                    {
                        IsExpiry = true;
                        objAccountRep.DisableUserByID(objWebUser.userid, false);
                        ViewData["ErrorMsg"] = "Your password is expired. Please click forgot password to reset.";
                        return View();
                    }

                }


                //check expiration
                if (IsExpiry)
                {
                    ViewData["ErrorMsg"] = "Your password is expired. Please click forgot password to reset";
                    return View();
                }


                if (Session[UserName] != null)
                    iTimes = Convert.ToInt32(Session[UserName]);

                if (iTimes < 5)
                {

                    if (objWebUser.password != sEncPassword)
                    {
                        // store failed count
                        if (Session[UserName] == null)
                            Session[UserName] = 0;

                        Session[UserName] = Convert.ToInt32(Session[UserName]) + 1;

                        ViewData["ErrorMsg"] = "Please enter the correct Password";
                        return View();

                    }
                    else
                    {
                        Session[UserName] = 0;

                        if (objWebUser.isnewuser.Trim().ToUpper() == "Y")
                        {
                            Session["UserId"] = objWebUser.userid;
                            Session["UserName"] = UserName;
                            Session["OrderBy"] = UserName;
                            Session["Phone1"] = "";
                            Session["Remarks"] = "";

                            Session["EmailID"] = UserName;
                            Session["Password"] = sEncPassword;
                            Session["IsDemo"] = 0;
                            Session["IsRemember"] = RememberMe;

                            //Forced to redirect confirm password page
                            return View("ChangePassword");
                            //Redirect("ChangePassword.aspx", true);
                        }

                    }
                }
                else
                {
                    //if consecutive attempts > 5 then disable the user and inform to contact admin
                    objAccountRep.DisableUserByID(objWebUser.userid, false);
                    ViewData["ErrorMsg"] = "Your account has been disabled due to several unsuccessful login attempts. Please contact administrator.";
                    return View();
                }


                //FormsAuthentication.RedirectFromLoginPage(UserName, true);

                //remeber me fun
                if (RememberMe)
                {
                    HttpCookie objCookie = new HttpCookie("NGCookie");
                    Response.Cookies.Add(objCookie);
                    objCookie.Values.Add("UserName", UserName);
                    //objCookie.Values.Add("Password", sPWD);                
                    Response.Cookies["NGCookie"].Expires = DateTime.Now.AddDays(15);
                }

                // Cache the user login data!
                SiteSession siteSession = new SiteSession(objWebUser);
                siteSession.VisitorLogID = objAccountRep.OnUserLogin(siteSession.UserId);
                Session["SiteSession"] = siteSession;

                Session[UserName] = null;// to reset the sever login attempt
                Session["UserName"] = objWebUser.username;
                Session["OrderBy"] = objWebUser.username;
                Session["Remarks"] = "";
                Session["UserRole"] = objWebUser.rolename;
                Session["CustomerName"] = objWebUser.customername;

                Session["EmailID"] = UserName;

                Session["Phone1"] = objWebUser.phone1;

                Session["RoleId"] = objWebUser.roleid;
                Session["UserId"] = objWebUser.userid;
                Session["CustomerId"] = objWebUser.customerid;
                Session["IsPseUser"] = objWebUser.customerid;

                //Session["DMSUser"] = objWebUser.dmsuser;
                //Session["DMSPwd"] = objWebUser.dmspwd;

                // Maintained to redirect to psenergy home while logout
                Session["FromHomePage"] = "true";

                //to redirect the demo user to demo Site.
                //if (objWebUser.customerid == 14 && objWebUser.roleid == 39) // For Demo Admin
                //{
                //    Response.Redirect("http://www.psenergy.com/fmwebdemo/frmlogin.aspx?U=" + Encrypt("user@psenergy.com") + "&P=" + Encrypt("user"));
                //}

                if (objWebUser.customerid == -1 || objWebUser.customerid == 1)
                {
                    return RedirectToAction("Index", "Home");
                    //Response.Redirect("pseAdmin.aspx", false);
                }
                else
                {

                    IMenuRepository objMenu = new MenuRepository();

                    //get all menulist
                    List<spGetMenuList_Result> menuList = objMenu.GetHorizonatalMenuList();

                    //get all authorized page list
                    siteSession.AuthPageList = objMenu.GetAuthorizedPageList();
                    
                    if(menuList == null)
                        return RedirectToAction("Home", "Home"); //, new { area = "DMS" });

                    spGetMenuList_Result menu = menuList.Where(x => x.IsDefault == true && x.MenuUrl != "").FirstOrDefault();
                    
                    //redirect to default page
                    if (menu != null)
                        return Redirect(menu.MenuUrl);

                    //or redirect to first menu
                    menu = menuList.First();
                    Session["MenuId"] = menu.MenuId;
                    TempData["MenuId"] = menu.MenuId;
                    //return RedirectToAction("Index", "DMS", new { area = "DMS"});
                    return RedirectToAction("Home", "Home");
                }

            }
            catch (Exception Ex)
            {
                ViewData["ErrorMsg"] = "Error Occured. Please contact administrator.";
                return View();
            }


        }

        public ViewResult ChangePassword()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ChangeUserPassword()
        {
            var jsonResult = new
            {
                view = RenderPartialViewToString("ChangeUserPassword")
            };

            if (Request.IsAjaxRequest())
            {
                JsonResult result = Json(jsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            return null;
        }

        [HttpPost]
        public JsonResult ForgetPassword()
        {
            var jsonResult = new
            {
                view = RenderPartialViewToString("ForgetPassword")
            };

            if (Request.IsAjaxRequest())
            {
                JsonResult result = Json(jsonResult, JsonRequestBehavior.AllowGet);
                return result;
            }
            return null;
        }

        [HttpPost]
        public JsonResult ConfirmChangePassword(string sOldPwd, string sNewPwd, string sQus, string sAns)
        {
            string jsonResult = "";
            string sEncPassword = "";
            try
            {
                SiteSession session = this.CurrentSiteSession;
                spGetUserByEmailId_Result objWebUser = null;
                if (Session["EmailID"] != null)
                    objWebUser = objAccountRep.GetUserByEmailId(Session["EmailID"].ToString());
                else
                    objWebUser = objAccountRep.GetUserByEmailId(session.UserName);

                if (objWebUser == null)
                {
                    jsonResult = "Error Occured, Please contact administrator.";
                    return Json(jsonResult, JsonRequestBehavior.AllowGet); ;
                }


                //if (objWebUser.passenctype == 1)
                    sEncPassword = PasswordHelper.HashEncrypt(sOldPwd);
                //else if (objWebUser.passenctype == 2)
                //    sEncPassword = PasswordHelper.Encrypt(sOldPwd);
                //else
                //    sEncPassword = sOldPwd;

                if (sEncPassword != objWebUser.password)
                {
                    jsonResult = "Old password incorrect.";
                    return Json(jsonResult, JsonRequestBehavior.AllowGet); ;
                }

                //no repeat of 5 generations to check
                sNewPwd = PasswordHelper.HashEncrypt(sNewPwd);

                bool bResult = objAccountRep.GetUserPasswordHistory(objWebUser.userid, PasswordHelper.HashEncrypt(sNewPwd));

                if (bResult)
                {
                    jsonResult = "Password should not been used in the previous 5 passwords.";
                    return Json(jsonResult, JsonRequestBehavior.AllowGet); ;
                }

                

                int iExpDays = int.Parse(ConfigurationManager.AppSettings["PasswordExpiryDays"]);
                bResult = objAccountRep.ChangePassword(objWebUser.customerid, objWebUser.userid, iExpDays, sOldPwd, sNewPwd, sQus, sAns);

                if (bResult)
                {
                    var resultSuccess = new
                    {
                        result = "Password Changed Successfully.",
                        customerid = objWebUser.customerid
                        
                    };

                    Session["EmailID"] = objWebUser.emailaddress;
                    Session["RoleId"] = objWebUser.roleid;
                    Session["UserId"] = objWebUser.userid;
                    Session["CustomerId"] = objWebUser.customerid;
                    Session["IsPseUser"] = objWebUser.customerid;

                    //Session["DMSUser"] = objWebUser.dmsuser;
                    //Session["DMSPwd"] = objWebUser.dmspwd;

                    SiteSession siteSession = new SiteSession(objWebUser);
                    siteSession.VisitorLogID = objAccountRep.OnUserLogin(siteSession.UserId);
                    Session["SiteSession"] = siteSession;

                    Session["UserName"] = objWebUser.username;
                    Session["OrderBy"] = objWebUser.username;
                    Session["Phone1"] = objWebUser.phone1;
                    Session["Remarks"] = "";

                    Session["UserRole"] = objWebUser.rolename;
                    Session["CustomerName"] = objWebUser.customername;

                    return  Json(resultSuccess, JsonRequestBehavior.AllowGet); 
                   
                }
                else
                    jsonResult = "Error Occured, Please contact administrator.";

                return Json(jsonResult, JsonRequestBehavior.AllowGet); ;
            }
            catch (Exception Ex)
            {
                jsonResult = "Error Occured, Please contact administrator.";
                return Json(jsonResult, JsonRequestBehavior.AllowGet); ;
            }
        }

        [HttpPost]
        public JsonResult ConfirmChangeUserPassword(string sOldPwd, string sNewPwd, string sQus, string sAns)
        {
            string jsonResult = "";
            string sEncPassword = "";
            try
            {
                SiteSession session = this.CurrentSiteSession;
                spGetUserByEmailId_Result objWebUser = null;
                if (session == null && Session["EmailID"] != null)
                    objWebUser = objAccountRep.GetUserByEmailId(Session["EmailID"].ToString());
                else
                    objWebUser = objAccountRep.GetUserByEmailId(session.UserName);

                if (objWebUser == null)
                {
                    jsonResult = "Error Occured, Please contact administrator.";
                    return Json(jsonResult, JsonRequestBehavior.AllowGet); ;
                }


                //if (objWebUser.passenctype == 1)
                    sEncPassword = PasswordHelper.HashEncrypt(sOldPwd);
                //else if (objWebUser.passenctype == 2)
                //    sEncPassword = PasswordHelper.Encrypt(sOldPwd);
                //else
                //    sEncPassword = sOldPwd;

                if (sEncPassword != objWebUser.password)
                {
                    jsonResult = "Old password incorrect.";
                    return Json(jsonResult, JsonRequestBehavior.AllowGet); ;
                }

                //no repeat of 5 generations to check
                sNewPwd = PasswordHelper.HashEncrypt(sNewPwd);
                bool bResult = objAccountRep.GetUserPasswordHistory(session.UserId, sNewPwd);

                if (bResult)
                {
                    jsonResult = "Password should not been used in the previous 5 passwords.";
                    return Json(jsonResult, JsonRequestBehavior.AllowGet); ;
                }

                int iExpDays = int.Parse(ConfigurationManager.AppSettings["PasswordExpiryDays"]);
                bResult = objAccountRep.ChangePassword(session.CustomerId, session.UserId, iExpDays, sOldPwd, sNewPwd, sQus, sAns);

                if (bResult)
                    jsonResult = "Password Changed Successfully.";
                else
                    jsonResult = "Error Occured, Please contact administrator.";

                return Json(jsonResult, JsonRequestBehavior.AllowGet); ;
            }
            catch (Exception Ex)
            {
                jsonResult = "Error Occured, Please contact administrator.";
                return Json(jsonResult, JsonRequestBehavior.AllowGet); ;
            }
        }

        [HttpPost]
        public JsonResult ConfirmForgetPassword(string sEmailId, string sQue, string sAns)
        {
            string sNewPassword = "", sMsg = "";
            int iResult = -1;
            try
            {
                tblUser objUser = objAccountRep.GetPasswordResetUser(sEmailId, sQue, sAns);
                if (objUser == null)
                    return Json("No record found to this Mail Id.", JsonRequestBehavior.AllowGet); ;

                sNewPassword = PasswordHelper.GeneratePassword(6, 10);

                iResult = objAccountRep.UpdateForgetPassword(objUser, sNewPassword);

                if (iResult > 0)
                {
                    
                    ViewData["Password"] = sNewPassword;
                    ViewData["MailTo"] = sEmailId;

                    sMsg = RenderPartialViewToString("MailForgetPassword");

                    //send mail - forget password
                    EmailHlp.SendHtmlMail(ConfigurationManager.AppSettings["mailFrom"].ToString(), sEmailId, sMsg, "Ordering system Web User Information", "", "", "");

                    return Json("Password sent successfully.", JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception Ex)
            {
            }
            return Json("Error Occured, Please contact an administrator.", JsonRequestBehavior.AllowGet); ;
        }

        [HttpPost]
        public JsonResult GetSecurityQuestions(string sEmailId)
        {
            try
            {
                spGetUserByEmailId_Result objWebUser = null;
                objWebUser = objAccountRep.GetUserByEmailId(sEmailId);
                return Json(objWebUser, JsonRequestBehavior.AllowGet); ;
            }
            catch (Exception Ex)
            {
                return null;
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }


       
    }
}
