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

            if (RTDS.Write(tagFullName, value))
            {
                //logger.Trace("Updating: " + tagFullName + " value: " + value);
            }
            else
            {
                //logger.Trace("Error in RTDS tag manipulation: " + tagFullName);
            }
        }
    }
}
