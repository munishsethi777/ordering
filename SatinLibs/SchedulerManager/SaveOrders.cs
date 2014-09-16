using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Quartz.Job;
using Quartz;
using Quartz.Impl;
using MVCEF.Infrastructure;
using Newtonsoft.Json;
using MVCEF.Controllers;
using System.Web.Mvc;
using System.Web.UI.HtmlControls;

namespace SatinLibs
{
    class SaveOrders: IJob
    {

        private static SatInHomeRepository satinHomeRepository;
        public void Execute(IJobExecutionContext context)
        {
            UploaderUtil uploaderUtil = new UploaderUtil();
            DataSet dataSet = uploaderUtil.UploadFile("722", null, "C://Users//arvinder singh//Downloads//SEJ (1).csv");
            string total = "1"; 
            string orderby = "Demo User";
            string phone= "23323";
            string remarks = "tst";
            string customerId = "722";            
            string orderDT = "";
            string header = "";
            int tableCount = dataSet.Tables.Count;
            string[] orderDTArr = new string[tableCount];
            string[] headerDTArr = new string[tableCount];
            DataTable table = null;
            for (int i = 0; i < tableCount; i++)
            {
                table = dataSet.Tables[i];
                orderDTArr[i] = "'" + DataSetUtils.GetJson(table) + "'";
                string headers = DataSetUtils.GetHeaderJson(table);
                headers = headers.Substring(1);
                headers = headers.Remove(headers.Length - 1);
                headerDTArr[i] = "'" + headers + "'"  ;

            }
            orderDT = string.Join(",", orderDTArr);
            header = string.Join(",", headerDTArr);
            orderDT = "[" + orderDT + "]";
            header = "[" + header + "]";

            if (satinHomeRepository == null)
            {
                satinHomeRepository = new SatInHomeRepository();
            }

            Dictionary<string, string> map = satinHomeRepository.SaveUploadedOrders(total, orderby, phone, remarks, orderDT, header, customerId);
            
        }
    }
}
