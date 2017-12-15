using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Configuration.Install;
using System.Reflection;

namespace SimaticHeartBeatService
{
  static class Program
  {
    /// <summary>
    /// The main entry point for the application.
    /// </summary>
    static void Main(string[] args)
    {
      /*DEBUG*/
      //While debugging this section is used.
      //Service1 myService = new Service1();
      //myService.onDebug();
      //System.Threading.Thread.Sleep(System.Threading.Timeout.Infinite);
      /*end debug */

      //In Release this section is used. This is the "normal" way.
      /**/
      if (Environment.UserInteractive)
      {
        string parameter = string.Concat(args);
        switch (parameter)
        {
          case "--install":
            ManagedInstallerClass.InstallHelper(new[] { Assembly.GetExecutingAssembly().Location });
            break;
          case "--uninstall":
            ManagedInstallerClass.InstallHelper(new[] { "/u", Assembly.GetExecutingAssembly().Location });
            break;
        }
      }
      else
      {
        ServiceBase[] servicesToRun = new ServiceBase[]
                          {
                              new Service1()
                          };
        ServiceBase.Run(servicesToRun);
      }
      

    }
  }
}
