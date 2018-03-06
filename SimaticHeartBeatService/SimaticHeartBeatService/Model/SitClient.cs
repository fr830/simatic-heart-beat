using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimaticHeartBeatService.Model
{
  public class SitClient
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Ip { get; set; }
    public DateTime LastHeartBeat { get; set; }
    public bool IsClientUp { get; set; }
    public int PingRoundTripTime { get; set; }
    public DateTime LastUpdate { get; set; }
    public bool PingPending { get; set; }
    public DateTime CreationDate { get; set; }
  }
}
