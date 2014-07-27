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

        public ParserUtil(string customerId, HttpPostedFileBase file, string fileLocation)
        {
            this.customerId = customerId;
            this.file = file;
            this.fileLocation = fileLocation;
            Type parserType = Type.GetType("CustId"+customerId+"Parser");
            //Activator.CreateInstance(parserType);
            parser = new CustId751Parser();
        }

        public DataSet getParsedDataSet()
        {
            return parser.getDataSet(customerId,fileLocation);            
        }
    }
}
