using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace SatinLibs
{
    public class ValidatorUtil
    {
        public static string[] validateUploadedFile(HttpPostedFileBase file, string customerId)
        {
            string[] errorMessage = new string[2];
            string status = IConstants.FAILED;
            string msg = IConstants.BLANK;
            if (customerId.Equals(IConstants.BLANK) || customerId.Equals("0"))
            {
                msg = IConstants.SELECT_CUSTOMER;
            }
            else if (!IsFileTypeValid(file))
            {
                msg = IConstants.INVALID_FILE;
            }
            else if (!isStoreAvaiable(customerId))
            {
                msg = IConstants.NO_STORE;
            }
            else
            {
                status = IConstants.SUCCUSS;
            }
            errorMessage[0] = status;
            errorMessage[1] = msg;
            return errorMessage;
        }


        private static bool IsFileTypeValid(HttpPostedFileBase file)
        {
            bool isValid = false;
            string ext = System.IO.Path.GetExtension(file.FileName);
            try
            {
                if (ext.ToLower().Equals(".pdf"))
                {
                    isValid = true;
                }
                else if (ext.ToLower().Equals(".csv"))
                {
                    isValid = true;
                }

                return isValid;
            }

            catch
            {
                return isValid;
            }
        }

        public static bool isStoreAvaiable(string customerIdStr)
        {

            int customerId = int.Parse(customerIdStr);
            DataSet dataSet = CustomerUtils.getStores(customerId);
            return dataSet.Tables[0].Rows.Count > 0;
        }

        private static bool isStoreAvaiable(int customerId, string storeName)
        {
            DataSet dataSet = CustomerUtils.getStores(customerId);
            if (dataSet == null)
            {
                return false;
            }
            foreach (DataRow row in dataSet.Tables[0].Rows)
            {
                if (storeName.Equals(row[0].ToString()))
                {
                    return true;
                }
            }
            return false;
        }
        public static Dictionary<string, string> validateSaveOrders(DataTable Order, DataTable sXMLOrders, Dictionary<string, ProductCustomer> customerProductMap, int customerId)
        {
            Dictionary<string, string> errorMap = new Dictionary<string, string>();
            SatInHomeRepository objectRepository = new SatInHomeRepository();

            string storeCode = sXMLOrders.Columns[4].ToString();
            storeCode = storeCode.Trim();
            if (!isStoreAvaiable(customerId, storeCode))
            {
                errorMap.Add(storeCode, "This store does not belong to the selected customer.");
                return errorMap;
            }

            /*
             * ---------Update Case----------- 
            Validation if order is not pending.*/
            if (Order.Rows.Count > 0)
            {
                string orderStatus = Order.Rows[0].ItemArray[1].ToString();
                string orderNo = Order.Rows[0].ItemArray[2].ToString();
                if (!orderStatus.Equals("1"))
                {
                    errorMap.Add(orderNo, "This order is already processed.Only Pending orders can be updated.");
                    return errorMap;
                }
                //Validation if customer cuttoffTime is over then no need to check other validation.
                DateTime cuttOffTime = CustomerUtils.getCuttOffTime(customerId);
                if (cuttOffTime.TimeOfDay < DateTime.Now.TimeOfDay)
                {
                    errorMap.Add(orderNo, "CuttOffTime is over.You can't upload order now.");
                    return errorMap;
                }

            }
            /*---------*/

            //Validation if customerCode is not exist in ProductCustomerMap Table.

            if (customerProductMap.Keys.Count == 0)
            {
                errorMap.Add("main_Error", "ProductCustomer Mapping does not exist for selected Customer");
            }
            return errorMap;
        }

        public static Dictionary<string, string> validateCustomerMap(DataTable Order, DataTable sXMLOrders, Dictionary<string, ProductCustomer> customerProductMap, int customerId)
        {
            Dictionary<string, string> errorMap = new Dictionary<string, string>();

            string storeCode = sXMLOrders.Columns[4].ToString();
            storeCode = storeCode.Trim();
            //Validation if external ItemId is not exist in ProductCustomerMap Table.
            int count = 1;
            foreach (DataRow row in sXMLOrders.Rows)
            {
                if (row[0] != null && row[0].ToString() != "0" && !string.IsNullOrEmpty(row[0].ToString()))
                {
                    string ext_ItemId = row[1].ToString();
                    if (!customerProductMap.Keys.Contains(ext_ItemId) &&
                        !errorMap.ContainsKey(ext_ItemId))
                    {
                        errorMap.Add(ext_ItemId, storeCode);
                        count++;
                    }
                }
            }
            return errorMap;
        }
    }
}