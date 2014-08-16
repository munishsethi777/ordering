using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Data;

namespace SatinLibs
{
    public class ParserUtil
    {
        private string customerId;
        private HttpPostedFileBase file;
        private string fileLocation;
        private ParserI parser = null;
        static log4net.ILog log = log4net.LogManager.GetLogger("ParserUtil");
        public ParserUtil(string customerId, HttpPostedFileBase file, string fileLocation)
        {
            log.Info("Parsing pdf for customer " + customerId);
            this.customerId = customerId;
            this.file = file;
            this.fileLocation = fileLocation;
            Type parserType = Type.GetType("CustId"+customerId+"Parser");
            //Activator.CreateInstance(parserType);
            if (customerId =="751"){
                parser = new CustId751Parser();
            }else if (customerId == "710"){
                parser = new CustId708Parser();
            }
           
        }

        public DataSet getParsedDataSet()
        {
            return parser.getDataSet(customerId,fileLocation);            
        }
    }
}
