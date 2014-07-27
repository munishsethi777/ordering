using System;
using System.Web.Mvc;
using System.Web.UI;
using MVCBusinessModel.Abstract;

namespace MVCEF.Controllers {
    [OutputCache(Location = OutputCacheLocation.None, NoStore = true)]
    public class ValidationController : Controller
    {


        IValidationRepository objValidationRep;

        public ValidationController(IValidationRepository objRepository)
        {
            objValidationRep = objRepository;
        }

        public JsonResult IsExistsWithCutomer(string primaryfield, string primaryvalue, string columnvalue, string tablename, string columnname, string customerid)
        {
            bool? bResult = false;
            try
            {
                bResult = objValidationRep.IsExists(primaryfield, int.Parse(primaryvalue), columnname, columnvalue, tablename, customerid);

                if (!bResult.Value)
                    return Json(true, JsonRequestBehavior.AllowGet);
            }
            catch (Exception EX)
            {
            }
            return Json(false, JsonRequestBehavior.AllowGet);
        }
        public JsonResult IsExists(string primaryfield, string primaryvalue, string columnvalue, string tablename, string columnname)
        {
            bool? bResult = false;
            try
            {
                bResult = objValidationRep.IsExists(primaryfield, int.Parse(primaryvalue), columnname, columnvalue, tablename, "0");

                if (!bResult.Value)
                    return Json(true, JsonRequestBehavior.AllowGet);
            }
            catch (Exception EX)
            {
            }
            return Json(false, JsonRequestBehavior.AllowGet);
        }
        public JsonResult IsNotExists(string columnvalue, string tablename, string columnname)
        {
            bool? bResult = false;
            try
            {
                bResult = objValidationRep.IsExists("", 0, columnname, columnvalue, tablename, "0");

                if (bResult.Value)
                    return Json(true, JsonRequestBehavior.AllowGet);
            }
            catch (Exception EX)
            {
            }
            return Json(false, JsonRequestBehavior.AllowGet);
        }

    }
}
