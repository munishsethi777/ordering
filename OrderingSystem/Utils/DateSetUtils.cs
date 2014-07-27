using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Reflection;
using System.Reflection.Emit;

namespace OrderingSystem
{
    public class DataSetUtils
    {
        public DataSet ToDataSet(TempOrder order)
        {
           
            DataSet dataset = new DataSet();
            List<TempOrderDetails> orderDetails = order.OrderDetails;
            {
                TempOrderDetails orderDetail = orderDetails[0];
                PropertyInfo[] properties = orderDetail.GetType().GetProperties();
                DataTable dt = CreateDataTable(properties);
                if (orderDetails.Count != 0)
                {
                    foreach (object o in orderDetails)
                        FillData(properties, dt, o);
                }
                
                dataset.Tables.Add(dt);
            }
            return dataset;
        }

        private DataTable CreateDataTable(PropertyInfo[] properties)
        {
            DataTable dt = new DataTable();
            DataColumn dc = null;
            foreach (PropertyInfo pi in properties)
            {
                dc = new DataColumn();
                dc.ColumnName = pi.Name;
                dc.DataType = pi.PropertyType;
                dt.Columns.Add(dc);
            }
            return dt;
        }

        private void FillData(PropertyInfo[] properties, DataTable dt, Object o)
        {
            DataRow dr = dt.NewRow();
            foreach (PropertyInfo pi in properties)
            {
                dr[pi.Name] = pi.GetValue(o, null);
            }
            dt.Rows.Add(dr);
        }
    }
}