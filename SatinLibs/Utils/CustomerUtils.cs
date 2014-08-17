using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MVCADOService;
using System.Data;
using MVCEF.Infrastructure;
namespace SatinLibs
{
    public class CustomerUtils
    {
        private static MVCEFEntities objectContext;
        private static MVCEFEntities getObjectContext()
        {
            if (objectContext == null)
            {
                objectContext = new MVCEFEntities();
            }
            return objectContext;
        }
        
        public DataSet  getAllCustomersDataSet()
        {
            string sSql = string.Format("select CustomerId, CustomerNo, CustomerName from tblcustomer order by CustomerName ASC");
            MVCADOService.MVCEFEntities objContext = getObjectContext();
            DataSet dsResult = objContext.ExecuteDataSet(sSql);
            return dsResult;
        }

        public static DataSet getStores(string customerId)
        {
            DataSet storesDataSet = null;
            try
            {
                MVCEFEntities objContext = getObjectContext();
                string sSql = string.Format(" select storecode, storename from tblstore where customerid = {0} and isactive='1' order by storeid ", customerId);
                storesDataSet = objContext.ExecuteDataSet(sSql);
                return storesDataSet;
            }
            catch (Exception e)
            {
                return storesDataSet;
            }

        }

        public static DateTime getCuttOffTime(String customerNo)
        {
            DateTime cuttOffTime = new DateTime();
            MVCEFEntities objContext = getObjectContext();
            string sSql = string.Format("select cutofftime from tblCustomer where customerNo = '{0}'", customerNo);
            cuttOffTime = (DateTime)objContext.ExecuteObject(sSql);
            return cuttOffTime;
        }

        public static String getCustomerCode(int customerId)
        {
            string code = null;
            try
            {
                MVCEFEntities objContext = getObjectContext();
                string sSql = string.Format(" select customerNo from tblCustomer where customerid = {0}", customerId);
                code = (string)objContext.ExecuteObject(sSql);
                return code;
            }
            catch (Exception e)
            {
                return code;
            }

        }
    }
}
