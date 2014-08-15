using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Quartz.Job;
using Quartz;
using Quartz.Impl;

namespace SatinLibs
{

    class InsertOrder: IJob
  
    {
        private OrderUtil orderUtil = null;
        public static string GetName()
        {
            return "InserOrderJob";
        }


        public static int GetRepetitionIntervalTime()
        {
           return 360;
        }

        public void Execute(IJobExecutionContext context)
        {
            if (orderUtil == null)
            {
                orderUtil = new OrderUtil();
            }
            orderUtil.inserOrder();
        }
    }
}
