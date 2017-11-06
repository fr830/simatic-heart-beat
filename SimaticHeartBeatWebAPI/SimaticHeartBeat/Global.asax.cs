using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using NLog;
using System.Timers;
using SimaticHeartBeat.Controllers;
using SimaticHeartBeat.Data;

namespace SimaticHeartBeat
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        private static SitClientsController sitClientsController;
        private static SitClientsRepository sitClientsRepository;
        private static SitConfigurationsRepository sitConfigurationsRepository;

    protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);

            // Web API configuration and services
            logger.Trace("Starting..." + DateTime.Now.ToString());
      /*
            sitClientsController = new SitClientsController();
            sitClientsRepository = new SitClientsRepository();
            sitConfigurationsRepository = new SitConfigurationsRepository();

            logger.Trace("Checking entities in DB");
            sitClientsRepository.checkClientsEntities();
            sitConfigurationsRepository.checkConfigurationsEntities();

            logger.Trace("Resetting Ping Pending statuses");
            sitClientsRepository.UpdateResetPingPending();

            logger.Trace("Scheduling sitClientWatchDog execution");
            System.Threading.Thread myThread = new System.Threading.Thread(new System.Threading.ThreadStart(sitClientsController.sitClientWatchDog));
            myThread.Start();
            */

    }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
            if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
            {
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "POST, PUT, DELETE");

                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
                HttpContext.Current.Response.AddHeader("Access-Control-Max-Age", "1728000");
                HttpContext.Current.Response.End();
            }
        }
    }
}
