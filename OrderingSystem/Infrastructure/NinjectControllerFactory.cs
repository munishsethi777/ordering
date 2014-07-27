using System;
using System.Web.Mvc;
using System.Web.Routing;
using Ninject;

using MVCBusinessModel.Abstract;
using MVCBusinessModel.Concrete;

using MVCBusinessModel.Abstract.Menu;
using MVCBusinessModel.Concrete.Menu;

using MVCBusinessModel.Abstract.Account;
using MVCBusinessModel.Concrete.Account;

//using MVCBusinessModel.Abstract.Admin;
//using MVCBusinessModel.Concrete.Admin;
//using MVCBusinessModel.Abstract.DMS;
//using MVCBusinessModel.Concrete.DMS;
//using MVCBusinessModel.Concrete.Dispatch;
//using MVCBusinessModel.Abstract.Dispatch;
//using MVCBusinessModel.Concrete.Report;
//using MVCBusinessModel.Abstract.Report;

namespace MVCEF.Infrastructure
{

    public class NinjectControllerFactory : DefaultControllerFactory 
    {
        private IKernel ninjectKernel;

        public NinjectControllerFactory() 
        {
            ninjectKernel = new StandardKernel();
            AddBindings();
        }

        protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
        {
            return controllerType == null? null : (IController)ninjectKernel.Get(controllerType);
        }
        public override void ReleaseController(IController controller)
        {
            base.ReleaseController(controller);
        }

        private void AddBindings() 
        {
            // home repository bindings  - comman one
            ninjectKernel.Bind<IHomeRepository>().To<HomeRepository>();

            // home repository bindings  - comman one
            ninjectKernel.Bind<IValidationRepository>().To<ValidationRepository>();

            // menu repository bindings 
            ninjectKernel.Bind<IMenuRepository>().To<MenuRepository>();

            // account bindings
            ninjectKernel.Bind<IAccountRepository>().To<AccountRepository>();

            //// admin module binding
            //ninjectKernel.Bind<IAdminRepository>().To<AdminRepository>();

            //// dms module binding
            //ninjectKernel.Bind<IDMSRepository>().To<DMSRepository>();

            //// dms dispatch module binding
            //ninjectKernel.Bind<IDispatchRepository>().To<DispatchRepository>();

            //// dms report module binding
            //ninjectKernel.Bind<IReportRepository>().To<ReportRepository>();
        }
    }
}