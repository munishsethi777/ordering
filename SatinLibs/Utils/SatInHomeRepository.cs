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
namespace SatinLibs
{
   public class SatInHomeRepository
    {

              
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
       public Boolean SaveOrders(string total, string orderby, string phone, string remarks, DataTable sXMLOrders, string customerId)
       {
           try
           {
               SiteSession session = (SiteSession)HttpContext.Current.Session["SiteSession"];
               int userId = session.UserId;
                
               object dsResult = null;
               MVCEFEntities objContext = null;
               string sSql = "";
               int orderId =0;
               if (!string.IsNullOrEmpty(total))
               {
                   total = total.Replace("$", "").Trim();
               }
               //set cuttoff time also on the order
               sSql = string.Format("exec spSaveOrders @customerid = {0}, @userid = {1}", int.Parse(customerId), userId);
               session.OrderId = Convert.ToInt16(objContext.ExecuteObject(sSql));
               orderId = session.OrderId;
               foreach (DataRow row in sXMLOrders.Rows)
               {
                   if (row[0] != null && row[0].ToString() != "0" && !string.IsNullOrEmpty(row[0].ToString()))
                   {
                       for (int i = 3; i < sXMLOrders.Columns.Count - 1; i++)
                       {

                           //first covert from map
                           sSql = string.Format(@"insert into tblorderdetail(orderid, storeid, productid, price, quantity, amount, remarks, remarks2)
                            select {0}, storeid, productid,{1}, {2} , {3}, '{4}', '{5}' from tblproduct p, tblstore s where skuid='{6}' and storecode='{7}' ",
                                       orderId, row[2], row[i], 0, row[sXMLOrders.Columns.Count - 1], "", row[0], sXMLOrders.Columns[i].ColumnName);
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

        private void getCustomerProductMap(int customerId){
            //call productCustomerMap table to fetch all information of the given customer;
            //you can find the storesProcedure for this.

            //insert itemId value from map table providing ext_itemId
            // insert qty into table by multiplying qty already to uommultiplier
        }
    }

    
}
