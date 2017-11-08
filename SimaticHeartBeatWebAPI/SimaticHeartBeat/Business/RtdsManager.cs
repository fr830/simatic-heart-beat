using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Configuration;
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


    }
  }
}