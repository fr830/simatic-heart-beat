using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SimaticHeartBeat.Models;
using SimaticHeartBeat.Data;
using NLog;
using System.Net.NetworkInformation;
using System.Threading;
using Newtonsoft.Json;
using SimaticHeartBeat.Business;

namespace SimaticHeartBeat.Controllers
{
    public class SitClientsController : ApiController
    {
        SitClientsRepository sitClientsRepository = new SitClientsRepository();
        SitConfigurationsRepository sitConfigurationsRepository = new SitConfigurationsRepository();
        RtdsManager rtdsManager = new RtdsManager();
        
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public bool StopSitClientWatchDog = false;

        [HttpGet]
        [ActionName("GetAllSitClients")]
        public IEnumerable<SitClient> GetAllSitClients()
        {
            List<SitClient> sitClients = sitClientsRepository.RetrieveSitClients();
            return sitClients;
        }

        [HttpGet]
        [ActionName("GetAllSitClientsHistory")]
        public IEnumerable<SitClient> GetAllSitClientsHistory()
        {
          List<SitClient> sitClients = sitClientsRepository.RetrieveSitClientsHistory();
          return sitClients;
        }

        [HttpGet]
        [ActionName("GetSitClient")]
        public IHttpActionResult GetSitClient(string argument)
        {
            var sitClient = sitClientsRepository.RetrieveSitClient(argument);
            if (sitClient == null)
            {
                return NotFound();
            }
            return Ok(sitClient);
        }

        [HttpGet]
        [ActionName("UpdateSitClientHeartBeat")]
        public IHttpActionResult UpdateSitClientHeartBeat(string argument)
        {
            SitClient clientToUpdate = new SitClient();
            clientToUpdate.Name = argument;

            sitClientsRepository.UpdateSitClientHeartBeat(clientToUpdate);

            return Ok();
        }

        [HttpGet]
        [ActionName("GetConfiguration")]
        public IHttpActionResult GetConfiguration()
        {
            return Ok(sitConfigurationsRepository.RetrieveSitConfiguration());
        }

        [HttpPost]
        [ActionName("EditOrInsertSitClient")]
        public HttpResponseMessage EditOrInsertSitClient(HttpRequestMessage argument)
        {
            string data = argument.Content.ReadAsStringAsync().Result;

            SitClient jsonArgument = JsonConvert.DeserializeObject<SitClient>(data);
            sitClientsRepository.EditOrInsertSitClient(jsonArgument);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [HttpPost]
        [ActionName("DeleteSitClient")]
        public HttpResponseMessage DeleteSitClient(HttpRequestMessage argument)
        {
            string data = argument.Content.ReadAsStringAsync().Result;

            SitClient jsonArgument = JsonConvert.DeserializeObject<SitClient>(data);
            sitClientsRepository.DeleteSitClient(jsonArgument);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [HttpPost]
        [ActionName("UpdatePingInterval")]
        public HttpResponseMessage UpdatePingInterval(HttpRequestMessage argument)
        {
            string data = argument.Content.ReadAsStringAsync().Result;

            ServerConfiguration jsonArgument = JsonConvert.DeserializeObject<ServerConfiguration>(data);
            sitConfigurationsRepository.UpdateSitClientSitClientPingInterval(jsonArgument);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [HttpGet]
        [ActionName("GetDisconnectedSitClientsBrowser")]
        public IEnumerable<SitClient> GetDisconnectedSitClientsBrowser()
        {
            List<SitClient> sitClients = sitClientsRepository.RetrieveDisconnectedSitClientsBrowser();
            return sitClients;
        }

        public void sitClientWatchDog()
        {
            logger.Trace("Checking Sit Clients");

            while (!StopSitClientWatchDog)
            {
                List<SitClient> sitClients = sitClientsRepository.RetrieveSitClients();
                foreach (SitClient c in sitClients)
                {
                    logger.Trace("Checking " + c.Name + " ip: " + c.Ip);

                    if (!c.PingPending)
                    {
                        Thread myThread = new Thread(new ThreadStart(() => PingSitClient(c)));
                        myThread.Start();
                    }
                    else
                    {
                        logger.Trace(c.Name + " ping on ip: " + c.Ip + " is still pending");
                    }
                }

                Thread.Sleep(sitConfigurationsRepository.RetrieveSitConfiguration().SitClientPingInterval);
            }
        }

        public void PingSitClient(SitClient c)
        {
            c.PingPending = true;
            sitClientsRepository.UpdateSitClientPingPending(c);

            try
            {
                Ping pingSender = new Ping();

                // The class Client has a property tcpClient of type TcpClient
                IPAddress address = IPAddress.Parse(c.Ip);
                PingReply reply = pingSender.Send(address);

                if (reply.Status == IPStatus.Success)
                {
                    logger.Trace("Success  " + c.Name + " ip: " + c.Ip + " RoundtripTime: " + reply.RoundtripTime);
                    c.IsClientUp = true;
                    c.PingRoundTripTime = Convert.ToInt32(reply.RoundtripTime);
                    rtdsManager.updateRtdsTag(c.Name, true);
                }
                else
                {
                    logger.Trace("Failed   " + c.Name + " ip: " + c.Ip);
                    c.IsClientUp = false;
                    c.PingRoundTripTime = 0;
                    rtdsManager.updateRtdsTag(c.Name, false);
                }

                sitClientsRepository.UpdateSitClientIsUpFlag(c);
            }
            catch (Exception ex)
            {
                logger.Trace(ex.ToString());
                logger.Trace("Error in testing " + c.Name + " ip: " + c.Ip + " probably ip was null");
                c.PingPending = false;
                rtdsManager.updateRtdsTag(c.Name, false);
                sitClientsRepository.UpdateSitClientPingPending(c);
            }
        }
    }
}