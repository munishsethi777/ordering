using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SatinLibs
{
   public class ProductCustomer
    {
       
            #region Primitive Properties

            public int Id
            {
                get;
                set;
            }

            public int CustomerId
            {
                get;
                set;
            }
            public string CustomerNo
            {
                get;
                set;
            }
            public string ItemId
            {
                get;
                set;
            }
            public string Ext_ItemId
            {
                get;
                set;
            }
            public int Quantity
            {
                get;
                set;
            }

            public int orderCuttOff
            {
                get;
                set;
            }
            public int UOMultipler
            {
                get;
                set;
            }

            #endregion
        }
    }

