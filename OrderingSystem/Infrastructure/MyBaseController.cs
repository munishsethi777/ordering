using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using MVCDataModel;
using Elmah;

public abstract class MyBaseController : Controller
{

    protected const string FAIL = "fail";
    protected const string SUCCESS = "success";
    protected const string ERROR_OCCURED_PLEASE_TRY_AGAIN = "Error occured please try again";
    protected const string SERVER_VALIDATION_FAILED = "Server validation failed, Please fill the required field";
    protected const string IS_NOT_AJAX_REQUEST = "Not an ajax Request, Not processed the request";


    protected const string ADD_FAIL = "Add operation failed, Please try again";
    protected const string ADD_SUCCESS = "Record Inserted Successfully";

    protected const string UPDATE_FAIL = "Update operation failed, Please try again";
    protected const string UPDATE_SUCCESS = "Record updated successfully";

    protected const string DELETE_FAIL = "Delete operation failed, Please try again";
    protected const string DELETE_SUCCESS = "Record deleted successfully";
    protected const string DEACTIVATED_SUCCESS = "Deactivated successfully";

    protected const string MAIL_FAIL= "Mail sending failed";
    protected const string MAIL_SUCCESS = "Mail sent.";
    protected const string COMMA = ", ";


    protected string sJsonResult = FAIL;
    protected string sJsonMsg = ERROR_OCCURED_PLEASE_TRY_AGAIN;

    protected JsonResult jSONResult 
    {
        get { 
        
            var json = new {
                result = sJsonResult,
                message = sJsonMsg
            };
            return Json(json, JsonRequestBehavior.AllowGet);
            //return " [{'result':'" + sJsonResult + "', 'message':'" + sJsonMsg + "'}]"; 
        
        }
    }

    /// <summary>
    /// Gets the current site session.
    /// </summary>
    public SiteSession CurrentSiteSession
    {
        get
        {
            if (HttpContext.Session["SiteSession"] != null)
            {
                SiteSession siteSession = (SiteSession)HttpContext.Session["SiteSession"];
                return siteSession;
            }
            return null;
        }
    }
    /// <summary>
    /// Disable the Async support.
    /// </summary>
    /// <remarks>
    /// Must be diable, otherwise ExecuteCore() will not be invoked in MVC4 like was in MVC3!
    /// </remarks>
    protected override bool DisableAsyncSupport
    {
        get { return true; }
    }

    /// <summary>
    /// Dispose the used resource.
    /// </summary>
    /// <param name="disposing">The disposing flag.</param>
    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
    }
    
    /*
    /// <summary>
    /// Manage the internationalization before to invokes the action in the current controller context.
    /// </summary>
    protected override void ExecuteCore()
    {
        int culture = 0;
        if (this.Session == null || this.Session["CurrentUICulture"] == null)
        {
            int.TryParse(System.Configuration.ConfigurationManager.AppSettings["Culture"], out culture);
            this.Session["CurrentUICulture"] = culture;
        }
        else
        {
            culture = (int)this.Session["CurrentUICulture"];
        }
        //
        SiteSession.CurrentUICulture = culture;
        //
        // Invokes the action in the current controller context.
        //
        base.ExecuteCore();
    }
    */

    /// <summary>
    /// Called when an unhandled exception occurs in the action.
    /// </summary>
    /// <param name="filterContext">Information about the current request and action.</param>
    protected override void OnException(ExceptionContext filterContext)
    {
        if (filterContext.Exception is UnauthorizedAccessException)
        {
            // Manage the Unauthorized Access exceptions
            // by redirecting the user to Home page.
        }

        //redirect to error view
        string sController = "", sAction = "";

        if (filterContext.RouteData != null)
        {
            if (filterContext.RouteData.Values["controller"] != null && !String.IsNullOrEmpty(filterContext.RouteData.Values["controller"].ToString()))
            {
                sController = filterContext.RouteData.Values["controller"].ToString();
            }
            if (filterContext.RouteData.Values["action"] != null && !String.IsNullOrEmpty(filterContext.RouteData.Values["action"].ToString()))
            {
                sAction = filterContext.RouteData.Values["action"].ToString();
            }
        }

        HttpSessionStateBase session = filterContext.HttpContext.Session;
        if (session["CustomerId"] == null)
        {
            LoginModel objModel = new LoginModel();
            objModel.IsSessionExpired = true;
            filterContext.Result = RedirectToAction("Logout", "Account", new { area = ""});
        }
        else
        {

            HandleErrorInfo error = new HandleErrorInfo(filterContext.Exception, sController, sAction);
            TempData["Error"] = error;
            filterContext.Result = RedirectToAction("ErrorFromBase", "Error", new { area = "" });
        }

        filterContext.ExceptionHandled = true;
        base.OnException(filterContext);

        // signal ELMAH to log the exception
        if (filterContext.ExceptionHandled)
            ErrorSignal.FromCurrentContext().Raise(filterContext.Exception);
    }

    protected string RenderPartialViewToString()
    {
        return RenderPartialViewToString(null, null);
    }

    protected string RenderPartialViewToString(string viewName)
    {
        return RenderPartialViewToString(viewName, null);
    }

    protected string RenderPartialViewToString(object model)
    {
        return RenderPartialViewToString(null, model);
    }

    protected string RenderPartialViewToString(string viewName, object model)
    {
        if (string.IsNullOrEmpty(viewName))
            viewName = ControllerContext.RouteData.GetRequiredString("action");

        ViewData.Model = model;

        using (StringWriter sw = new StringWriter())
        {
            ViewEngineResult viewResult = ViewEngines.Engines.FindPartialView(ControllerContext, viewName);
            ViewContext viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
            viewResult.View.Render(viewContext, sw);

            return sw.GetStringBuilder().ToString();
        }
    }
    //protected string RenderPartialViewToString(string viewName, string controllername)
    //{
    //    RequestContext rc = ((MvcHandler)HttpContext.CurrentHandler).RequestContext;
    //    IControllerFactory factory = ControllerBuilder.Current.GetControllerFactory();
    //    //controllerName = "HomeController";
    //    IController controller = factory.CreateController(rc, controllername);
    //    ControllerContext cc = new ControllerContext(rc, (ControllerBase)controller);

    //    if (string.IsNullOrEmpty(viewName))
    //        viewName = ControllerContext.RouteData.GetRequiredString("action");

    //    ViewData.Model = null;

    //    using (StringWriter sw = new StringWriter())
    //    {
    //        ViewEngineResult viewResult = ViewEngines.Engines.FindPartialView(cc, viewName);
    //        ViewContext viewContext = new ViewContext(cc, viewResult.View, ViewData, TempData, sw);
    //        viewResult.View.Render(viewContext, sw);

    //        return sw.GetStringBuilder().ToString();
    //    }
    //}
   

    //public ActionResult Login()
    //{
    //    return RedirectToAction("Login", "Account", new { area = "" });
    //    // or
    //    //return this.Response.RedirectToRoute("Default", new { controller = "Account", action = "Login", area = "" });
    //}
    protected override void OnActionExecuting(ActionExecutingContext filterContext)
    {
        //to check sessions
        HttpSessionStateBase session = filterContext.HttpContext.Session;
        SiteSession objSiteSession = (SiteSession)session["SiteSession"];

        if (session == null && objSiteSession == null && !session.IsNewSession)
        {
            //redirect to login page
            filterContext.Result = RedirectToAction("Logout", "Account", new { area = "" });
        }

        if (filterContext.RequestContext != null && filterContext.HttpContext.Request.IsAjaxRequest() )
            return;
        

        //for validate the redirect pages - authenticte or not
        var currentRouteData = filterContext.RouteData;
        var currentController = " ";
        var currentAction = " ";

        if (currentRouteData != null)
        {
            if (currentRouteData.Values["controller"] != null && !String.IsNullOrEmpty(currentRouteData.Values["controller"].ToString()))
            {
                currentController = currentRouteData.Values["controller"].ToString();
            }

            if (currentRouteData.Values["action"] != null && !String.IsNullOrEmpty(currentRouteData.Values["action"].ToString()))
            {
                currentAction = currentRouteData.Values["action"].ToString();
            }
        }

        if (objSiteSession != null)
        {
            List<spGetPageList_Result> pageList = objSiteSession.PageList;
            List<tblAuthorizedPage> authPageList = objSiteSession.AuthPageList;
            spGetPageList_Result page = null;
            tblAuthorizedPage authPage = null;
            if (pageList != null)
            {
                
                page = pageList.Where(x => x.Action == currentAction && x.Controller == currentController).FirstOrDefault();

                if (page == null)
                {

                    authPageList = objSiteSession.AuthPageList;
                    if (authPageList != null)
                    {
                        authPage = authPageList.Where(x => x.Action == currentAction && x.Controller == currentController).FirstOrDefault();

                        if (authPage == null)
                            filterContext.Result = RedirectToAction("UnAuthorizedAccess", "Error", new { area = "" });

                    }
                }
            }
        }


    }
    protected override void OnActionExecuted(ActionExecutedContext filterContext)
    {

    }
        

    /*
    public ActionResult Error()
    {
        return View("Error");
    }
    */

}