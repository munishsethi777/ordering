using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCADOService;
using MVCEF.Infrastructure;
using MVCDataModel;

namespace SatinLibs
{
    public class OrderUtil
    {
        public void inserOrder()
        {
            SatInHomeRepository repository = new SatInHomeRepository();
            string orderNumber = repository.InsertOrder();
            
        }

 
    }

}