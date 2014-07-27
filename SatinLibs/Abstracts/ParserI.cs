using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Data;
namespace SatinLibs
{
    interface ParserI
    {
        DataSet getDataSet(string customerId, string fileLocation);
    }
}
