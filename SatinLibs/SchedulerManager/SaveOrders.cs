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
using System.Collections.Specialized;
using System.IO;
using System.Web;
using System.Configuration;
namespace SatinLibs
{
    class SaveOrders: IJob
    {
        static String folderPath = "C://inetpub//KFCFiles//raw";
        static String folderCopyToPath = "C://inetpub//KFCFiles//backup//";
        //static String folderCopyToPath = "C://Users//arvinder singh//Downloads//CSV//backup//";
       // static String folderPath = "C://Users//arvinder singh//Downloads//CSV";

        static log4net.ILog log = log4net.LogManager.GetLogger("SaveOrders");
        private static SatInHomeRepository satinHomeRepository;
        public void Execute(IJobExecutionContext context)
        {
            log.Info("init scheduler for KFC");
            try
            {
                String[] filePaths = FileUtils.getFilesFromFolder(folderPath, "csv");
                foreach (String filePath in filePaths)
                {
                    executeJobPerFile(filePath);
                }
            }
            catch (Exception e)
            {
                log.Error("Error During parse order for KFC", e);
            }
        }

        private void executeJobPerFile(String filePath){
            log.Info("executing save for file : -" + filePath);
            MailerUtil mailerUtils = MailerUtil.getInstance();
            string customerId = "722";
            UploaderUtil uploaderUtil = new UploaderUtil();
            try
            {

                DataSet dataSet = uploaderUtil.UploadFile(customerId, null, filePath);
                string total = "1";
                string orderby = "Demo User";
                string phone = "";
                string remarks = "";

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
                    headerDTArr[i] = "'" + headers + "'";
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

                if(map.ContainsKey("pendingOrders")){
                    string pendingOrders = map["pendingOrders"];
                    if (pendingOrders.Equals("0"))
                    {
                        copyAndRemove(filePath);
                    }
                    else
                    {
                        log.Info("Failed to save the order from file : - " + filePath);
                    }
                }
                mailerUtils.SendSaveOrderNotification(customerId, map);

            }
            catch (Exception e)
            {
                string message = e.Message + "<br / >" + e.StackTrace;
                mailerUtils.ParseErrorNotification(customerId, message);
                log.Error("Error During parse order for customerId : - " + customerId, e);
            } 
            
        }

        private void copyAndRemove(string filePath)
        {
            log.Info("Saved KFC order for file : -" + filePath);
            string fileName = Path.GetFileName(filePath);
            File.Copy(filePath, folderCopyToPath + fileName, true);
            File.Delete(filePath);
        }
    }
}
