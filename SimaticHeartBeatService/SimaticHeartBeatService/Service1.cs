using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using NLog;
using SimaticHeartBeatService.Business;
using System;

namespace SimaticHeartBeatService
{
  public partial class Service1 : ServiceBase
  {
    private System.ComponentModel.IContainer components = null;
    private static Logger logger = LogManager.GetCurrentClassLogger();
    private SitClientManager sitClientManager;
    private ServerConfigurationManager serverConfigurationManager;
    public Service1()
    {
      InitializeComponent();
      //System.Threading.Thread.Sleep(10000);
    }

    protected override void OnStart(string[] args)
    {
      logger = LogManager.GetCurrentClassLogger();
      components = new System.ComponentModel.Container();
      
      logger.Trace("Starting..." + DateTime.Now.ToString());
      sitClientManager = new SitClientManager();
      serverConfigurationManager = new ServerConfigurationManager();

      logger.Trace("Checking entities in DB");
      sitClientManager.checkClientsEntities();
      sitClientManager.checkClientsHistoryEntities();
      serverConfigurationManager.checkConfigurationsEntities();

      logger.Trace("Resetting Ping Pending statuses");
      sitClientManager.UpdateResetPingPending();

      logger.Trace("Scheduling sitClientWatchDog execution");
      System.Threading.Thread myThread = new System.Threading.Thread(new System.Threading.ThreadStart(sitClientManager.sitClientWatchDog));
      myThread.Start();
          }

    protected override void OnStop()
    {
    }
  }
}
