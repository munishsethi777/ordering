using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;

using MVCBusinessModel.Abstract.Menu;
using MVCDataModel;

namespace MVCEF.Controllers.Menu
{
    public class NavMenuController : MyBaseController
    {
        private IMenuRepository objMenuRep = null;

        public NavMenuController(IMenuRepository objMenu)
        {
            objMenuRep = objMenu;
        }

        public ViewResult HorizontalMenu()
        {
            return View("HorizontalMenu", objMenuRep.GetHorizonatalMenuList());
        }
        public ViewResult VerticalMenu()
        {
            try
            {


                SiteSession session = this.CurrentSiteSession;
                if (session != null && session.HMenuId > 0)
                {
                    return View("VerticalMenu", objMenuRep.GetVerticalMenuList(session.HMenuId));
                }
                else
                {
                    List<MVCDataModel.spGetPageList_Result> pageList = new List<MVCDataModel.spGetPageList_Result>();
                    return View("VerticalMenu", pageList);
                }
            }
            catch (Exception Ex)
            {
            }
            return View("VerticalMenu", null);
        }
        public ViewResult VerticalMenuById(int iMenuId)
        {
            ((SiteSession)HttpContext.Session["SiteSession"]).HMenuId = iMenuId;

            //menu selection - hide previous active menu
            Session["MenuUrl"] = "";

            //menu selection - hide previous active page
            Session["PageId"] = "";

            //for menu selection - show current menu
            Session["MenuId"] = iMenuId;
            return View("VerticalMenu", objMenuRep.GetVerticalMenuList(iMenuId));
        }
        public void SelectVerticalMenu(int iPageId)
        {
            //for menu selection - show current menu
            Session["PageId"] = iPageId;
        }


    }
}
