using System;
using System.Linq;
using System.Web.Mvc;
using MVCBusinessModel.Abstract;
using MVCBusinessModel.Concrete;
using System.Text;
using System.Data;
using MVCEF.Infrastructure;
//using MVCBusinessModel.Abstract.DMS;
//using MVCBusinessModel.Concrete.DMS;
using MVCADOService;
using MVCDataModel;
using System.Web;

namespace MVCEF.HTMLHelpers
{
    public static partial class Html
    {
        #region Bind DropDown
        public static MvcHtmlString BindAccount(this HtmlHelper html)
        {
            try
            {
                //deinitialize the account
                ((SiteSession)HttpContext.Current.Session["SiteSession"]).AccountID = "";

                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtCustomer = objDMSRep.BindAccount();

                foreach (DataRow row in dtCustomer.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindTankGroup(this HtmlHelper html)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindTankGroup();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindTankGroupText(this HtmlHelper html)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindTankGroup();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Text"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindUsers(this HtmlHelper html)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindUsers();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindBeepForUser(this HtmlHelper html)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindBeepForUser();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }

        public static MvcHtmlString BindState(this HtmlHelper html)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objHomeRep.BindState();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["StateCode"], row["StateName"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString EditState(this HtmlHelper html, string sStateCode)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objHomeRep.BindState();

                foreach (DataRow row in dtResult.Rows)
                {
                    if (sStateCode == row["StateCode"].ToString())
                        sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["StateCode"], row["StateName"]));
                    else
                        sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["StateCode"], row["StateName"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindTimeZone(this HtmlHelper html)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objHomeRep.BindTimeZone();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Id"], row["Name"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindIconName(this HtmlHelper html)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();
                DataTable dtResult = objDMSRep.BindIconName();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }

        public static MvcHtmlString BindReportSortOrder(this HtmlHelper html)
        {
            try
            {

                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();
                DataTable dtResult = objDMSRep.BindReportSortOrder();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindNextDays(this HtmlHelper html)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                int iOrderValue = 1;
                int? iCount = 30; //objHomeRep.MenuCount();
                iCount++;
                while (iOrderValue <= iCount)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", iOrderValue, iOrderValue));
                    iOrderValue++;
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindProduct(this HtmlHelper html)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindProduct();

                foreach (DataRow row in dtResult.Rows)
                {

                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindOEProduct(this HtmlHelper html)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindOEProduct();

                foreach (DataRow row in dtResult.Rows)
                {

                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        #endregion

        #region Tank OE Default
        public static MvcHtmlString EditAscendOEProduct(this HtmlHelper html, int? iId)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();
                DataTable dtResult = objDMSRep.BindAscendOEProduct();
                foreach (DataRow row in dtResult.Rows)
                {
                    if (iId != null && iId.Value.ToString() == row["Value"].ToString())
                        sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Value"], row["Text"]));
                    else
                        sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString EditAscendDestination(this HtmlHelper html, int? iId)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();
                DataTable dtResult = objDMSRep.BindAscendDestination();
                foreach (DataRow row in dtResult.Rows)
                {
                    if (iId != null && iId.Value.ToString() == row["Value"].ToString())
                        sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Value"], row["Text"]));
                    else
                        sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString EditCarrier(this HtmlHelper html, int? iId)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();
                DataTable dtResult = objDMSRep.BindCarrier();
                foreach (DataRow row in dtResult.Rows)
                {
                    if (iId != null && iId.Value.ToString() == row["Value"].ToString())
                        sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Value"], row["Text"]));
                    else
                        sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString EditTerminal(this HtmlHelper html, int? iId)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();
                DataTable dtResult = objDMSRep.BindTerminal();
                foreach (DataRow row in dtResult.Rows)
                {
                    if (iId != null && iId.Value.ToString() == row["Value"].ToString())
                        sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Value"], row["Text"]));
                    else
                        sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString EditSupplier(this HtmlHelper html, int? iId)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();
                DataTable dtResult = objDMSRep.BindSupplier();
                foreach (DataRow row in dtResult.Rows)
                {
                    if (iId != null && iId.Value.ToString() == row["Value"].ToString())
                        sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Value"], row["Text"]));
                    else
                        sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }

        public static MvcHtmlString BindAscendOEProduct(this HtmlHelper html)
        {
            try
            {
                MVCEFEntities context = new MVCEFEntities();
                StringBuilder sbHtmlResult = new StringBuilder();
                DataTable dtResult = (from x in context.spGetProduct()
                                      select new { Value = x.Prodid, Text = x.LongDescr }).ToList().ToDataTable();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindAscendDestination(this HtmlHelper html)
        {
            try
            {
                MVCEFEntities context = new MVCEFEntities();
                StringBuilder sbHtmlResult = new StringBuilder();
                DataTable dtResult = (from x in context.spGetDestination()
                                      select new { Value = x.ShipToID, Text = x.FormattedDescr }).ToList().ToDataTable();

                foreach (DataRow row in dtResult.Rows)
                {

                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindCarrier(this HtmlHelper html)
        {
            try
            {
                MVCEFEntities context = new MVCEFEntities();
                StringBuilder sbHtmlResult = new StringBuilder();
                DataTable dtResult = (from x in context.spGetCarrier()
                                      select new { Value = x.CarrierID, Text = x.CODE }).ToList().ToDataTable();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindTerminal(this HtmlHelper html)
        {
            try
            {
                MVCEFEntities context = new MVCEFEntities();
                StringBuilder sbHtmlResult = new StringBuilder();
                DataTable dtResult = (from x in context.spGetTerminal()
                                      select new { Value = x.Supplyptid, Text = x.CODE }).ToList().ToDataTable();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindSupplier(this HtmlHelper html)
        {
            try
            {
                MVCEFEntities context = new MVCEFEntities();
                StringBuilder sbHtmlResult = new StringBuilder();
                DataTable dtResult = (from x in context.spGetSupplier()
                                      select new { Value = x.SupplierID, Text = x.CODE }).ToList().ToDataTable();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }

        #endregion

        #region Edit DropDown
        public static MvcHtmlString EditSite(this HtmlHelper html, string sSiteID)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindSite(sSiteID);

                foreach (DataRow row in dtResult.Rows)
                {
                    //if (sSiteID == row["Value"].ToString())
                    //    sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Value"], row["Text"]));
                    //else
                    sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString EditDestination(this HtmlHelper html, string sDestination)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindDestination();

                foreach (DataRow row in dtResult.Rows)
                {
                    if (sDestination == row["Value"].ToString())
                        sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Value"], row["Text"]));
                    else
                        sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString EditARAccount(this HtmlHelper html, string sARAccount)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindARAccount();

                foreach (DataRow row in dtResult.Rows)
                {
                    if (sARAccount == row["Text"].ToString())
                        sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Text"], row["Text"]));
                    else
                        sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Text"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString EditProduct(this HtmlHelper html, string sProduct)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindProduct();

                foreach (DataRow row in dtResult.Rows)
                {
                    if (sProduct == row["Value"].ToString())
                        sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Value"], row["Text"]));
                    else
                        sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }

        public static MvcHtmlString EditOEProduct(this HtmlHelper html, string sOEProduct)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindOEProduct();

                foreach (DataRow row in dtResult.Rows)
                {
                    if (sOEProduct == row["Value"].ToString())
                        sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Value"], row["Text"]));
                    else
                        sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString EditBeepForUser(this HtmlHelper html, int iUserId)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindBeepForUser();

                foreach (DataRow row in dtResult.Rows)
                {
                    if (iUserId.ToString() == row["Value"].ToString())
                        sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Value"], row["Text"]));
                    else
                        sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString EditTankGroup(this HtmlHelper html, int iGroupId)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindTankGroup();

                foreach (DataRow row in dtResult.Rows)
                {
                    if (iGroupId.ToString() == row["Value"].ToString())
                        sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Value"], row["Text"]));
                    else
                        sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString EditSubGroup(this HtmlHelper html, int iGroupId, int iSubGroupId)
        {
            try
            {
                IDMSRepository objDMSRep = new DMSRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objDMSRep.BindSubGroup(iGroupId);

                foreach (DataRow row in dtResult.Rows)
                {
                    if (iSubGroupId.ToString() == row["Value"].ToString())
                        sbHtmlResult.Append(string.Format("<option value={0} selected='selected'>{1}</option>", row["Value"], row["Text"]));
                    else
                        sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["Value"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        #endregion
    }
}