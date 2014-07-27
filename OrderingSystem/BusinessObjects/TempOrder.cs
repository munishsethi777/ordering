using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OrderingSystem
{
    public partial class TempOrder
    {
        public int Seq { get; set; }
        public string OrderId{get; set;}
        public string CustomerId { get; set; }
        public System.DateTime OrderDate { get; set; }
        public System.DateTime DeliveryDate { get; set; }
        public int OrderStatusId { get; set; }
        public  System.DateTime CutOffTime{get;set;}
        public string Remarks{get;set;}
        public System.DateTime CreatedOn { get; set; }
        public decimal Amount { get; set; }
        public List<TempOrderDetails> OrderDetails { get; set; }

    }
}