using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Configuration;
using SITCAB.RTDS;
using NLog;

namespace SimaticHeartBeat.Business
{
  public class RtdsManager
  {
    private static Logger logger = LogManager.GetCurrentClassLogger();
    private string siteName = WebConfigurationManager.AppSettings["siteName"];
    private string rtdsSourceUnit = WebConfigurationManager.AppSettings["rtdsSourceUnit"];
    public void updateRtdsTag(string clientName, bool value)
    {
      string tagFullName = rtdsSourceUnit + "\\" + siteName + "_" + clientName + "_HeartBeat_WEB";

      try{
        if (RTDS.ExistThrough(tagFullName))
        {
          logger.Trace("Updating: " + tagFullName + " value: " + value);
          RTDS.Write(tagFullName, value);
        }
        else
        {
          logger.Trace("Updating Failed: " + tagFullName + " does not exists ");
        }
      }catch(Exception ex)
      {
        logger.Trace("Error in RTDS tag manipulation: " + ex.ToString());
      }
    }
  }
}