using System;
using System.Web.Mvc;
using MVCBusinessModel.Abstract;
using MVCBusinessModel.Concrete;
using System.Text;
using System.Data;
using MVCDataModel;

namespace MVCEF.HTMLHelpers
{
    public static partial class Html
    {

        public static MvcHtmlString BindCustomers(this HtmlHelper html)
        {
            MvcHtmlString objResult = null;
            try
            {


                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtCustomer = objHomeRep.BindCustomer();

                foreach (DataRow row in dtCustomer.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["CustomerId"], row["CustomerName"]));
                }

                objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindCustomersName(this HtmlHelper html)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtCustomer = objHomeRep.BindCustomer();

                foreach (DataRow row in dtCustomer.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["CustomerName"], row["CustomerName"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static SelectViewModel BindCustomerList(this HtmlHelper html)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                SelectViewModel dtCustomer = objHomeRep.BindCustomerList();
                return dtCustomer;
            }
            catch (Exception Ex)
            {
            }
            return null;
        }

        public static MvcHtmlString BindCustomersSelection(this HtmlHelper html)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtCustomer = objHomeRep.BindCustomersSelection();

                foreach (DataRow row in dtCustomer.Rows)
                {
                    sbHtmlResult.Append(string.Format("<li><label class='radio customerSelection'><input type='radio' name='optionsCustomer' value='{0}'/>{1}</label>", row["CustomerId"], row["CustomerName"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindOrders(this HtmlHelper html)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                int iOrderValue = 1;
                int? iCount = 10; //objHomeRep.MenuCount();
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
        public static MvcHtmlString BindMenu(this HtmlHelper html, int iCustomerId)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objHomeRep.BindMenu(iCustomerId);

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["MenuId"], row["MenuTitle"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindGroup(this HtmlHelper html, int iCustomerId)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objHomeRep.BindGroup(iCustomerId);

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["GroupId"], row["GroupTitle"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindPage(this HtmlHelper html)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objHomeRep.BindPage();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["PageId"], row["PageTitle"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString BindRole(this HtmlHelper html, int iCustomerId)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objHomeRep.BindRole(iCustomerId);

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value={0}>{1}</option>", row["RoleID"], row["RoleName"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }

        public static MvcHtmlString BindDisplay(this HtmlHelper html, int iType)
        {
            try
            {
                StringBuilder sbHtmlResult = new StringBuilder();
                if (iType == 1) // for tank list
                {
                    sbHtmlResult.Append("<option value=\"1,4\">Display</option>");
                    sbHtmlResult.Append("<option value=\"1,4\" selected=\"selected\">1 X 4</option>");
                    sbHtmlResult.Append("<option value=\"2,4\">2 X 4</option>");
                    sbHtmlResult.Append("<option value=\"3,4\">3 X 4</option>");
                }
                else if (iType == 2) // for tank map
                {
                    sbHtmlResult.Append("<option value=\"1,10\">Display</option>");
                    sbHtmlResult.Append("<option value=\"1,10\" selected=\"selected\">10</option>");
                    sbHtmlResult.Append("<option value=\"1,25\">25</option>");
                    sbHtmlResult.Append("<option value=\"1,50\">50</option>");
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }



        public static MvcHtmlString BindOrderStatus(this HtmlHelper html)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objHomeRep.BindOrderStatus();

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
        public static MvcHtmlString BindOrderStatusText(this HtmlHelper html)
        {
            try
            {
                IHomeRepository objHomeRep = new HomeRepository();
                StringBuilder sbHtmlResult = new StringBuilder();

                DataTable dtResult = objHomeRep.BindOrderStatus();

                foreach (DataRow row in dtResult.Rows)
                {
                    sbHtmlResult.Append(string.Format("<option value=\"{0}\">{1}</option>", row["Text"], row["Text"]));
                }

                MvcHtmlString objResult = new MvcHtmlString(sbHtmlResult.ToString());
                return objResult;
            }
            catch (Exception Ex)
            {
            }
            return new MvcHtmlString("");
        }

    }
}