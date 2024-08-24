using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ResumeBuilder
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "FormRoute",
                url: "Form",
                defaults: new { controller = "Home", action = "Form" }
            );


            routes.MapRoute(
                name: "TemplatesRoute",
                url: "Resumetemplates",
                defaults: new { controller = "Home", action = "Resumetemplates" }
            );

            routes.MapRoute(
                name: "Temp1Route",
                url: "Templates/Temp1",
                defaults: new { controller = "Home", action = "Temp1" }
            );

            routes.MapRoute(
                name: "Temp2Route",
                url: "Templates/Temp2",
                defaults: new { controller = "Home", action = "Temp2" }
            );

            routes.MapRoute(
                name: "Temp3Route",
                url: "Templates/Temp3",
                defaults: new { controller = "Home", action = "Temp3" }
            );
            routes.MapRoute(
               name: "Temp4Route",
               url: "Templates/Temp4",
               defaults: new { controller = "Home", action = "Temp4" }
           );

            routes.MapRoute(
               name: "Temp5Route",
               url: "Templates/Temp5",
               defaults: new { controller = "Home", action = "Temp5" }
           );

            routes.MapRoute(
               name: "Temp6Route",
               url: "Templates/Temp6",
               defaults: new { controller = "Home", action = "Temp6" }
           );
            routes.MapRoute(
               name: "Temp7Route",
               url: "Templates/Temp7",
               defaults: new { controller = "Home", action = "Temp7" }
           );
            routes.MapRoute(
               name: "Temp8Route",
               url: "Templates/Temp8",
               defaults: new { controller = "Home", action = "Temp8" }
           );
        }
    }
}
