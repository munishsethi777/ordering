using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Data;
using MVCADOService;
using MVCEF.Infrastructure;
using MVCDataModel;
using System.Web;
using MvcJqGrid;
namespace SatinLibs
{
   public class SatInHomeRepository
    {

       private MVCEFEntities objContext = new MVCEFEntities();
       public Boolean SaveUploadedOrders(string total, string orderby, string phone, string remarks, string data, string header, string customerId)
        {

            try
            {
                Newtonsoft.Json.Linq.JArray jData = JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JArray>(data);
                Newtonsoft.Json.Linq.JArray jHeader = JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JArray>(header);
                DataTable dtResult = new DataTable("Order");
                foreach (var item in jHeader)
                {
                    dtResult.Columns.Add(item.ToString());
                }
                string name = "";
                foreach (var row in jData)
                {
                    DataRow dr = dtResult.NewRow();
                    for (int i = 0; i < dtResult.Columns.Count; i++)
                    {
                        if (row[i].ToString() == "")
                            dr[i] = "0";
                        else
                            dr[i] = row[i].ToString();

                        name = jHeader[i].ToString();      
                    }
                    dtResult.Rows.Add(dr);
                }
              return SaveOrders(total, orderby, phone, remarks, dtResult, customerId);
              }
            catch (Exception Ex)
            {
            }
            return false;
        }
       public Boolean SaveOrders(string total, string orderby, string phone, string remarks, DataTable sXMLOrders, string customerIdStr)
       {
           try
           {
               SiteSession session = (SiteSession)HttpContext.Current.Session["SiteSession"];
               int userId = session.UserId;
               int customerId = int.Parse(customerIdStr);
               object dsResult = null;
               string sSql = "";
               int orderId =0;
               if (!string.IsNullOrEmpty(total))
               {
                   total = total.Replace("$", "").Trim();
               }
               //set cuttoff time also on the order
               String customerCode = CustomerUtils.getCustomerCode(customerId);
               Dictionary<String, ProductCustomer> map = getCustomerProductMap(customerCode);
               sSql = string.Format("exec spSaveOrders @customerid = {0}, @userid = {1}", customerId, userId);
               orderId = Convert.ToInt16(objContext.ExecuteObject(sSql));
               foreach (DataRow row in sXMLOrders.Rows)
               {
                   if (row[0] != null && row[0].ToString() != "0" && !string.IsNullOrEmpty(row[0].ToString()))
                   {
                      
                    String ext_ItemId = row[1].ToString();
                    if (map.Keys.Contains(ext_ItemId))
                    {
                        ProductCustomer productCust = map[ext_ItemId];
                        int qnty = int.Parse(row[4].ToString());
                        qnty = productCust.UOMultipler * qnty;
                        String skuId = productCust.ItemId;
                        sSql = string.Format(@"insert into tblorderdetail(orderid, storeid, productid, price, quantity, amount, remarks, remarks2)
                            select {0}, storeid, productid,{1}, {2} , {3}, '{4}', '{5}' from tblproduct p, tblstore s where skuid='{6}' and storecode='{7}' ",
                                    orderId, row[3], qnty, 0, row[sXMLOrders.Columns.Count - 1], "", skuId, sXMLOrders.Columns[4].ColumnName);
                        dsResult = objContext.ExecuteQuery(sSql);
                    }

                   }
               }

               return true;
           }
           catch (Exception Ex)
           {
               return false;
           }
       }

       private Dictionary<String,ProductCustomer> getCustomerProductMap(string customerNo)
       {
            string sSql = string.Format("select * from  tblProductCustomerMap where customerid = '{0}'", customerNo);
            DataSet customerDataSet = objContext.ExecuteDataSet(sSql);
            int totalCustomers = customerDataSet.Tables[0].Rows.Count;
            Dictionary<String, ProductCustomer> map = new Dictionary<String, ProductCustomer>();
            for (int i = 0; i < totalCustomers; i++)
            {
                DataRow row = customerDataSet.Tables[0].Rows[i];
                ProductCustomer productCustomer = new ProductCustomer();
                productCustomer.ItemId = row.ItemArray[1].ToString();
                productCustomer.CustomerNo = row.ItemArray[2].ToString();
                productCustomer.UOMultipler = int.Parse(row.ItemArray[3].ToString());
                productCustomer.Ext_ItemId = row.ItemArray[4].ToString();
                productCustomer.orderCuttOff = int.Parse(row.ItemArray[5].ToString());
                
                map.Add(productCustomer.Ext_ItemId, productCustomer);
            }
            return map;

            //call productCustomerMap table to fetch all information of the given customer;
            //you can find the storesProcedure for this.

            //insert itemId value from map table providing ext_itemId
            // insert qty into table by multiplying qty already to uommultiplier
        }

       public object GridDataOrderDashboard(GridSettings objGrdSettings)
       {
           try
           {
               DataSet objOrderDashboard = GetOrderDashboardList(objGrdSettings);
               Int64 objTot = Convert.ToInt64(objOrderDashboard.Tables[1].Rows[0]["Cnt"]);

               if (objOrderDashboard == null)
                   return null;

               var jsonData = new
               {
                   total = objTot / objGrdSettings.PageSize + 1,
                   page = objGrdSettings.PageIndex,
                   records = objTot,
                   rows = (
                       from c in objOrderDashboard.Tables[0].AsEnumerable()
                       select new
                       {
                           id = c["orderid"],
                           cell = new object[] 
                                { 
                                    c["orderid"], // first primary key
                                    c["isdisabled"],
                                    c["customername"],
                                    c["ordereddate"].ToPSEDate(),
                                    c["orderstatus"],
                                    c["cutofftime"],
                                    "$ " + c["totalamount"].ToPSEDecimal(),
                                    c["username"],
                                    c["createddate"].ToPSEDate(),
                                    c["lastchangeddate"].ToPSEDate(),
                                    c["lastchangeduser"]
                                }
                       }).ToArray()
               };
               return jsonData;
           }
           catch (Exception Ex)
           {
           }

           return null;
       }

       private DataSet GetOrderDashboardList(GridSettings objGrdSettings)
        {
            try
            {

                //sp param
                string sParam = "";
               // sParam += string.Format("@CustomerID = {0}", session.CustomerId);

                // for paging
                if (objGrdSettings.PageSize > 0)
                {
                    sParam += string.Format("@startindex = {0}, @endindex = {1}", ((objGrdSettings.PageIndex - 1) * objGrdSettings.PageSize) + 1, (objGrdSettings.PageIndex * objGrdSettings.PageSize));
                }

                //for search
                string sSearchString = "";
                if (objGrdSettings.Where != null)
                {
                    foreach (var item in objGrdSettings.Where.rules)
                    {
                        if (item.field.Contains("date"))
                            sSearchString += string.Format(" and convert(varchar, {0}, 101) like ''{1}%'' ", item.field, item.data);
                        else
                            sSearchString += string.Format(" and CONVERT(VARCHAR, ISNULL({0},0)) like ''{1}%'' ", item.field, item.data);
                    }
                    sParam += string.Format(", @SearchBy = ' {0}'", sSearchString);
                }

                //for sorting
                string sOrderBy = "";
                if (!string.IsNullOrEmpty(objGrdSettings.SortColumn))
                {
                    if(objGrdSettings.SortColumn.Contains("date"))
                        sOrderBy += string.Format(" {0} {1} ", objGrdSettings.SortColumn, objGrdSettings.SortOrder);
                    else
                        sOrderBy += string.Format(" CONVERT(VARCHAR, ISNULL({0},0)) {1} ", objGrdSettings.SortColumn, objGrdSettings.SortOrder);

                    sParam += string.Format(", @OrderBy = ' {0}'", sOrderBy);
                }


                //sql query result
                DataSet dsResult = null;
                string sSql = string.Format("EXEC satIn_spGetOrders {0}", sParam);
                dsResult = objContext.ExecuteDataSet(sSql);
               // session.SqlQuery = sSql;
                return dsResult;
            }
            catch (Exception Ex)
            {
                return null;
            }

        }

    }

    
}
