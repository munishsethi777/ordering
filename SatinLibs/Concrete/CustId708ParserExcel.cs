using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MVCEF.Infrastructure;
using System.Data;
using System.Web;
using System.Data.OleDb;

namespace SatinLibs
{
   public class CustId2ParserExcel : ParserI
    {
        public DataSet getDataSet(string customerId, string fileLocation)
        {
            DataSet ds = new DataSet();
            DataSet storesDataSet = CustomerUtils.getStores(customerId);
            string excelConnectionString = string.Empty;
            excelConnectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" +
                    fileLocation + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=1\"";
            OleDbConnection excelConnection = new OleDbConnection(excelConnectionString);
            excelConnection.Open();
            DataTable dt = new DataTable();
            dt = excelConnection.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
            if (dt == null)
            {
                return null;
            }

            String[] excelSheets = new String[dt.Rows.Count];
            int t = 0;
            //excel data saves in temp file here.
            foreach (DataRow row in dt.Rows)
            {
                excelSheets[t] = row["TABLE_NAME"].ToString();
                t++;
            }
            OleDbConnection excelConnection1 = new OleDbConnection(excelConnectionString);
            string query = string.Format("Select * from [{0}]", excelSheets[0]);
            using (OleDbDataAdapter dataAdapter = new OleDbDataAdapter(query, excelConnection1))
            {
                dataAdapter.Fill(ds);
                excelConnection.Close();
                excelConnection1.Close();
            }

            DataTable mytable = new DataTable();
            DataRow totalItemRows = ds.Tables[0].Rows[6];
            string totalRowsCountStr = (string)totalItemRows.ItemArray[1];
            int totalRowsCount = int.Parse(totalRowsCountStr);
            DataRow colHeaders = ds.Tables[0].Rows[9];
            mytable.Columns.Add("Sl#");
            mytable.Columns.Add("Product");
            mytable.Columns.Add("Price");
            int storesCount = storesDataSet.Tables[0].Rows.Count;

            if (storesCount > 0)
            {
                for (int i = 0; i < storesCount; i++)
                {
                    mytable.Columns.Add(storesDataSet.Tables[0].Rows[i].ItemArray[0].ToString());
                }
            }
            else
            {
                mytable.Columns.Add("Delivery");
            }
            mytable.Columns.Add("Remarks");

            DataSet mydataset = new DataSet();

            for (int i = 10; i <= totalRowsCount + 9; i++)
            {
                DataRow row = ds.Tables[0].Rows[i];
                string itemNo = row.ItemArray[3].ToString();
                string itemName = row.ItemArray[2].ToString();
                string price = row.ItemArray[6].ToString();

                object[] array = new object[storesCount + 4];
                if (storesCount == 0)
                {
                    array = new object[1 + 4];
                }


                array[0] = itemNo;
                array[1] = itemName;
                array[2] = price;


                int rowCounter = 3;
                if (storesCount == 0)
                {
                    array[rowCounter++] = row.ItemArray[9].ToString();
                }
                else
                {
                    for (int j = 0; j < storesCount; j++)
                    {
                        array[rowCounter++] = row.ItemArray[9].ToString();
                    }
                }


                string remarks = "";
                array[rowCounter] = remarks;

                mytable.Rows.Add(array);
            }

            mydataset.Tables.Add(mytable);
            return mydataset;
        }
    }
}
