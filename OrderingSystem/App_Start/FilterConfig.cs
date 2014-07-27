using System.Web.Mvc;

namespace MVCEF
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());

            //extend the HandleError filter and signal to ELMAH 
            filters.Add(new MVCEF.Filters.ElmahHandleErrorAttribute());

            //filters.Add(new MVCEF.Filters.SessionExpireFilterAttribute());
        }
    }
}