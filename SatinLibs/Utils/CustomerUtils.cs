﻿using System;
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
        public DataSet  getAllCustomersDataSet()
        {
            string sSql = string.Format("select CustomerId, CustomerNo, CustomerName from tblcustomer order by CustomerName ASC");
            MVCADOService.MVCEFEntities objContext = new MVCADOService.MVCEFEntities(); 
            DataSet dsResult = objContext.ExecuteDataSet(sSql);
            return dsResult;
        }

        public static DataSet getStores(string customerId)
        {
            DataSet storesDataSet = null;
            try
            {
                MVCEFEntities objContext = new MVCEFEntities();
                string sSql = string.Format(" select storecode, storename from tblstore where customerid = {0} and isactive='1' order by storeid ", customerId);
                storesDataSet = objContext.ExecuteDataSet(sSql);
                return storesDataSet;
            }
            catch (Exception e)
            {
                return storesDataSet;
            }

        }

        public static String getCustomerCode(int customerId)
        {
            string code = null;
            try
            {
                MVCEFEntities objContext = new MVCEFEntities();
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
