using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using MVCADOService;
using System.Data;
using MVCEF.Infrastructure;
namespace SatinLibs
{
    public class UploaderUtil
    {
        public DataSet UploadFile(string customerId, HttpPostedFileBase file, string fileLocation){
            ParserUtil parserUtil = new ParserUtil(customerId,file, fileLocation);
            return parserUtil.getParsedDataSet();           
        }
    }
}
