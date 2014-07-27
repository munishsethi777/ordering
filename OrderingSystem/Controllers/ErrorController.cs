using System.Web.Mvc;

namespace MVCEF.Controllers
{
    public class ErrorController : Controller
    {
        //
        // GET: /Error/

        public ActionResult Index()
        {
            return View("Error");
        }
        public ActionResult NotFound()
        {
            return View("Error");
        }

        public ActionResult ErrorFromBase()
        {
            HandleErrorInfo error = null;
            if (TempData["Error"] != null)
                error = TempData["Error"] as HandleErrorInfo; 

            return View("Error", error);
        }
        public ActionResult UnAuthorizedAccess()
        {
            return View("UnAuthorizedAccess");
        }
    }
}
