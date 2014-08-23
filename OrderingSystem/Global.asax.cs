using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using MVCEF.Infrastructure;
using MVCDataModel;
using MVCEF.Controllers;
using SatinLibs;
namespace MVCEF
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {

            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);

            //extend the HandleError filter and signal to ELMAH 
            //GlobalConfiguration.Configuration.Filters.Add(new CustomExceptionFilter());

            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            //for defaultcontrol factory
            ControllerBuilder.Current.SetControllerFactory(new NinjectControllerFactory());
            log4net.Config.XmlConfigurator.Configure();
            JobManager.Runscheduler();

        }
        protected void Session_Start()
        {
            //initialise session values
            Session["MenuId"] = "";
            Session["MenuUrl"] = "";
            Session["PageId"] = "";
        }

        protected void Application_Error()
        {
            try
            {

                var httpContext =  HttpContext.Current;

                var currentRouteData = RouteTable.Routes.GetRouteData(new HttpContextWrapper(httpContext));
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

                var ex = Server.GetLastError();

                var controller = new ErrorController();
                var routeData = new RouteData();
                var action = "Index";

                if (ex is HttpException)
                {
                    var httpEx = ex as HttpException;

                    switch (httpEx.GetHttpCode())
                    {
                        case 404:
                            action = "NotFound";
                            break;

                        // others if any

                        default:
                            action = "Index";
                            break;
                    }
                }

                httpContext.ClearError();
                httpContext.Response.Clear();
                httpContext.Response.StatusCode = ex is HttpException ? ((HttpException)ex).GetHttpCode() : 500;
                httpContext.Response.TrySkipIisCustomErrors = true;
                routeData.Values["controller"] = "Error";
                routeData.Values["action"] = action;

                controller.ViewData.Model = new HandleErrorInfo(ex, currentController, currentAction);
                ((IController)controller).Execute(new RequestContext(new HttpContextWrapper(httpContext), routeData));
            }
            catch (Exception Ex)
            {
                throw;
            }

            try
            {
                /*
                HttpContext ctx = HttpContext.Current;
                KeyValuePair<string, object> error = new KeyValuePair<string, object>("ErrorMessage", ctx.Server.GetLastError().ToString());
                ctx.Response.Clear();
                RequestContext rc = ((MvcHandler)ctx.CurrentHandler).RequestContext;
                string controllerName = rc.RouteData.GetRequiredString("controller");
                IControllerFactory factory = ControllerBuilder.Current.GetControllerFactory();
                //controllerName = "HomeController";
                IController controller = factory.CreateController(rc, controllerName);
                ControllerContext cc = new ControllerContext(rc, (ControllerBase)controller);


                ViewResult viewResult = new ViewResult { ViewName = "Error" };
                viewResult.ViewData.Add(error);
                viewResult.ExecuteResult(cc);
                ctx.Server.ClearError();
                //ctx.Response.End();

                //or use this to redirect error page 
                this.Response.RedirectToRoute("Default", new { controller = "Home", action = "Error", area="" });
                */
            }
            catch (Exception Ex)
            {
            }

        }

        /// <summary>
        /// Session End event used to insert an entry in the visitors log.
        /// </summary>
        /// <param name="sender">The sender.</param>
        /// <param name="e">The arguments.</param>
        protected void Session_End(object sender, EventArgs e)
        {
            SiteSession siteSession = (Session["SiteSession"] == null ? null : (SiteSession)Session["SiteSession"]);
            //using (MvcBasicSiteEntities db = new MvcBasicSiteEntities())
            //{
            //    VisitorLog.OnUserLogoff(db, (siteSession == null ? 0 : siteSession.VisitorLogID), true);
            //}
        }
    }
}