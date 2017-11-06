using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SITCAB.RTDS;
using NLog;
using System.Configuration;

namespace SimaticHeartBeatService.Business
{
  public class RtdsManager
  {
    private static Logger logger = LogManager.GetCurrentClassLogger();
    private string siteName = System.Configuration.ConfigurationManager.AppSettings["siteName"];
    private string rtdsSourceUnit = System.Configuration.ConfigurationManager.AppSettings["rtdsSourceUnit"];
    public void updateRtdsTag(string clientName, bool value)
    {
      string tagFullName = rtdsSourceUnit + "\\" + siteName + "_" + clientName + "_HeartBeat_WEB";

      try
      {
        if (RTDS.ExistThrough(tagFullName))
        {
          logger.Trace("Updating: " + tagFullName + " value: " + value);
          RTDS.Write(tagFullName, value);
        }
        else
        {
          logger.Trace("Updating Failed: " + tagFullName + " does not exists ");
        }
      }
      catch (Exception ex)
      {
        logger.Trace("Error in RTDS tag manipulation: " + ex.ToString());
      }
    }
  }
}
