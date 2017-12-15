using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration.Install;
using System.Linq;
using System.Threading.Tasks;

namespace SimaticHeartBeatService
{
  [RunInstaller(true)]
  public partial class srv : System.Configuration.Install.Installer
  {
    public srv()
    {
      InitializeComponent();
    }
  }
}
