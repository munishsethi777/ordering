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
            string[] errorMessage = new string[2] ;
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
                if(ext.ToLower().Equals(".pdf"))
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

        public static bool isStoreAvaiable(string customerid)
        {
            DataSet dataSet = CustomerUtils.getStores(customerid);
            return dataSet.Tables[0].Rows.Count > 0;
        }

        public static Dictionary<string, string> validateSaveOrders(DataTable sXMLOrders, string customerCode)
        {
            Dictionary<string, string> errorMap = new Dictionary<string, string>();
            SatInHomeRepository objectRepository = new SatInHomeRepository();
            Dictionary<String, ProductCustomer> map = objectRepository.getCustomerProductMap(customerCode);
            if (map.Keys.Count == 0)
            {
                errorMap.Add("main_Error", "ProductCustomer Mapping does not exist for selected Customer");
            }else{
                int count = 1;
                foreach (DataRow row in sXMLOrders.Rows)
                {
                    if (row[0] != null && row[0].ToString() != "0" && !string.IsNullOrEmpty(row[0].ToString()))
                    {
                        string ext_ItemId = row[1].ToString();
                        string orderNumber = row[0].ToString();
                        if (!map.Keys.Contains(ext_ItemId))
                        {
                            errorMap.Add(count + "." + "OrderNo." + orderNumber, "Error is SKU ID - " + ext_ItemId + " does not exist in ProductCustomer mapping");
                            count++;
                        }
                    }
                }
            }
            
            return errorMap;
        }
    }
}