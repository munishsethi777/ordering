using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SatinLibs
{
    public class TempOrderDetails
    {
        public int Seq { get; set; }
        public int OrderSeq { get; set; }
        public int StoreId { get; set; }
        public string ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public decimal Quantity { get; set; }
        public decimal Amount { get; set; }
        public string Remarks { get; set; }
        public string Remarks2 { get; set; }
    }
}