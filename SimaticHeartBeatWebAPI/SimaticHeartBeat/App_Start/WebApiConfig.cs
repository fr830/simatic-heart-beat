using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Net.Http.Headers;
using NLog;
using System.Timers;
using SimaticHeartBeat.Controllers;
using SimaticHeartBeat.Data;

namespace SimaticHeartBeat
{
    public static class WebApiConfig
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        private static SitClientsController sitClientsController;
        private static SitClientsRepository sitClientsRepository;
        private static SitConfigurationsRepository sitConfigurationsRepository;

        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            /*
            logger.Trace("Starting..." + DateTime.Now.ToString());
            sitClientsController = new SitClientsController();
            sitClientsRepository = new SitClientsRepository();
            sitConfigurationsRepository = new SitConfigurationsRepository();
            */
            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "ActionApi",
                routeTemplate: "api/{controller}/{action}/{argument}",
                defaults: new { argument = RouteParameter.Optional }
            );

            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
            /*
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

    }
}
