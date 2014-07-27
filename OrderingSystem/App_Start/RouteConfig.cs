using System.Web.Mvc;
using System.Web.Routing;

namespace MVCEF
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Account", action = "Login", id = UrlParameter.Optional },
                namespaces: new[] { "MVCEF.Account.Controllers" }
                
            );

            routes.MapRoute(
                name: "AdminHome",
                url: "{area}/{controller}/{action}",
                defaults: new { controller = "Admin", action = "Index", area="Admin" },
                namespaces: new[] { "MVCEF.Areas.Admin.Controllers" }

            );
        }
    }
}