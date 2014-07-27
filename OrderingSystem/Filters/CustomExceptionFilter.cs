using System.Web.Mvc;
using Elmah;

namespace MVCEF.Filters
{
    public class ElmahHandleErrorAttribute : HandleErrorAttribute
    {
        public override void OnException(ExceptionContext filterContext)
        {
            base.OnException(filterContext);

            // signal ELMAH to log the exception
            if (filterContext.ExceptionHandled)
                ErrorSignal.FromCurrentContext().Raise(filterContext.Exception);
        }
    }
}