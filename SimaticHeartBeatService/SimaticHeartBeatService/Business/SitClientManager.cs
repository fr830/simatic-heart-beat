using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Collections.Specialized;
using NLog;
using SimaticHeartBeatService.Model;
using SimaticHeartBeatService.Business;
using System.Net.NetworkInformation;
using System.Threading;
using System.Net;


namespace SimaticHeartBeatService.Business
{
  class SitClientManager
  {
    private string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ClientsDatabase"].ConnectionString;
    private static Logger logger = LogManager.GetCurrentClassLogger();
    public bool StopSitClientWatchDog = false;
    private ServerConfigurationManager serverConfigurationManager = new ServerConfigurationManager();
    private RtdsManager rtdsManager = new RtdsManager();

    public void UpdateResetPingPending()
    {
      SqlConnection sqlConnection = new SqlConnection(connectionString);
      DateTime timestamp = DateTime.Now;

      SqlCommand cmd = new SqlCommand();
      string sql = "";
      cmd.CommandType = System.Data.CommandType.Text;
      try
      {
        sql = "Update SitClients set LastUpdate = '" + timestamp.ToString() + "', PingPending = 0";
        cmd.CommandText = sql;

        cmd.Connection = sqlConnection;

        sqlConnection.Open();
        cmd.ExecuteNonQuery();
        sqlConnection.Close();
      }
      catch (Exception ex)
      {
        logger.Trace("Exception in database call: " + ex.ToString());
      }
    }

    public void checkClientsEntities()
    {
      SqlConnection sqlConnection = new SqlConnection(connectionString);

      SqlCommand cmd = new SqlCommand();
      string sql = "";
      cmd.CommandType = System.Data.CommandType.Text;
      try
      {
        sql = @"if not exists (select * from sysobjects where name='SitClients' and xtype='U') 
                    CREATE TABLE SitClients(
	                    Id int IDENTITY(1,1) NOT NULL,
	                    Name nvarchar(max) NULL,
	                    Ip nvarchar(max) NULL,
	                    LastHeartBeat datetime NULL,
	                    IsClientUp bit NULL,
	                    PingRoundTripTime int NULL,
	                    LastUpdate datetime NULL,
	                    PingPending bit NULL,
	                    CreationDate datetime NULL,
                        NodeType int NULL
                    )";
        cmd.CommandText = sql;

        cmd.Connection = sqlConnection;

        sqlConnection.Open();
        cmd.ExecuteNonQuery();
        sqlConnection.Close();
      }
      catch (Exception ex)
      {
        logger.Trace("Exception in database call: " + ex.ToString());
      }
    }

    public void checkClientsHistoryEntities()
    {
        SqlConnection sqlConnection = new SqlConnection(connectionString);

        SqlCommand cmd = new SqlCommand();
        string sql = "";
        cmd.CommandType = System.Data.CommandType.Text;
        try
        {
            sql = @"if not exists (select * from sysobjects where name='SitClientsHistory' and xtype='U') 
                    CREATE TABLE SitClientsHistory(
	                    Id int IDENTITY(1,1) NOT NULL,
	                    Name nvarchar(max) NULL,
	                    Ip nvarchar(max) NULL,
	                    IsClientUp bit NULL,
	                    PingRoundTripTime int NULL,
	                    LastUpdate datetime NULL
                    )";
            cmd.CommandText = sql;

            cmd.Connection = sqlConnection;

            sqlConnection.Open();
            cmd.ExecuteNonQuery();
            sqlConnection.Close();
        }
        catch (Exception ex)
        {
            logger.Trace("Exception in database call: " + ex.ToString());
        }
    }

    public List<SitClient> RetrieveSitClients()
    {
      List<SitClient> sitClients = new List<SitClient>();

      SqlCommand command;
      string sql = null;
      SqlDataReader dataReader;
      sql = @"select * from SitClients";

      SqlConnection cnn;
      cnn = new SqlConnection(connectionString);
      try
      {
        cnn.Open();
        command = new SqlCommand(sql, cnn);
        dataReader = command.ExecuteReader();
        while (dataReader.Read())
        {
          SitClient sitClientToAdd = new SitClient();
          if (!dataReader.IsDBNull(0)) { sitClientToAdd.Id = Convert.ToInt32(dataReader.GetValue(0)); }
          if (!dataReader.IsDBNull(1)) { sitClientToAdd.Name = Convert.ToString(dataReader.GetValue(1)); }
          if (!dataReader.IsDBNull(2)) { sitClientToAdd.Ip = Convert.ToString(dataReader.GetValue(2)); }
          if (!dataReader.IsDBNull(3)) { sitClientToAdd.LastHeartBeat = Convert.ToDateTime(dataReader.GetValue(3)); }
          if (!dataReader.IsDBNull(4)) { sitClientToAdd.IsClientUp = Convert.ToBoolean(dataReader.GetValue(4)); }
          if (!dataReader.IsDBNull(5)) { sitClientToAdd.PingRoundTripTime = Convert.ToInt32(dataReader.GetValue(5)); }
          if (!dataReader.IsDBNull(6)) { sitClientToAdd.LastUpdate = Convert.ToDateTime(dataReader.GetValue(6)); }
          if (!dataReader.IsDBNull(7)) { sitClientToAdd.PingPending = Convert.ToBoolean(dataReader.GetValue(7)); }
          if (!dataReader.IsDBNull(8)) { sitClientToAdd.CreationDate = Convert.ToDateTime(dataReader.GetValue(8)); }

          sitClients.Add(sitClientToAdd);

        }
        dataReader.Close();
        command.Dispose();
        cnn.Close();

      }
      catch (Exception ex)
      {
        logger.Trace("Exception in database call: " + ex.ToString());
      }

      return sitClients;
    }



    public void UpdateSitClientPingPending(SitClient clientToUpdate)
    {
      SqlConnection sqlConnection = new SqlConnection(connectionString);
      DateTime timestamp = DateTime.Now;

      SqlCommand cmd = new SqlCommand();
      string sql = "";
      cmd.CommandType = System.Data.CommandType.Text;
      try
      {
        int IsPingPending = clientToUpdate.PingPending ? 1 : 0;
        sql = "Update SitClients set PingPending = " + IsPingPending + ", LastUpdate = '" + timestamp.ToString() + "' where Ip = '" + clientToUpdate.Ip + "'";
        cmd.CommandText = sql;

        cmd.Connection = sqlConnection;

        sqlConnection.Open();
        cmd.ExecuteNonQuery();
        sqlConnection.Close();
      }
      catch (Exception ex)
      {
        logger.Trace("Exception in database call: " + ex.ToString());
      }
    }

    public void UpdateSitClientIsUpFlag(SitClient clientToUpdate)
    {
      SqlConnection sqlConnection = new SqlConnection(connectionString);
      DateTime timestamp = DateTime.Now;

      SqlCommand cmd = new SqlCommand();
      string sql = "";
      cmd.CommandType = System.Data.CommandType.Text;
      try
      {
        int IsClientUpInt = clientToUpdate.IsClientUp ? 1 : 0;
        sql = "Update SitClients set IsClientUp = " + IsClientUpInt + ", PingRoundTripTime = " + clientToUpdate.PingRoundTripTime + ", LastUpdate = '" + timestamp.ToString() + "', PingPending = 0 where Ip = '" + clientToUpdate.Ip + "'";
        cmd.CommandText = sql;

        cmd.Connection = sqlConnection;

        sqlConnection.Open();
        cmd.ExecuteNonQuery();
        sqlConnection.Close();
      }
      catch (Exception ex)
      {
        logger.Trace("Exception in database call: " + ex.ToString());
      }
    }

    public void InsertSitClientHistory(SitClient clientToInsert)
    {
        SqlConnection sqlConnection = new SqlConnection(connectionString);
        DateTime timestamp = DateTime.Now;

        SqlCommand cmd = new SqlCommand();
        string sql = "";
        cmd.CommandType = System.Data.CommandType.Text;
        try
        {
            int IsClientUpInt = clientToInsert.IsClientUp ? 1 : 0;
            sql = "Insert into SitClientsHistory (Name, Ip, IsClientUp, PingRoundTripTime, LastUpdate) values ('" + clientToInsert.Name + "', '" + clientToInsert.Ip + "', " + IsClientUpInt + ", " + clientToInsert.PingRoundTripTime + ", '" + timestamp.ToString() + "')";
            cmd.CommandText = sql;

            cmd.Connection = sqlConnection;

            sqlConnection.Open();
            cmd.ExecuteNonQuery();
            sqlConnection.Close();
            deleteOldSitClientHistory();
        }
        catch (Exception ex)
        {
            logger.Trace("Exception in database call: " + ex.ToString());
        }
    }

    public void deleteOldSitClientHistory()
    {
        SqlConnection sqlConnection = new SqlConnection(connectionString);
        DateTime lastWeek = DateTime.Now.AddDays(-7);

        SqlCommand cmd = new SqlCommand();
        string sql = "";
        cmd.CommandType = System.Data.CommandType.Text;
        try
        {
            sql = "delete from SitClientsHistory where LastUpdate < '" + lastWeek.ToString() + "'";
            cmd.CommandText = sql;

            cmd.Connection = sqlConnection;

            sqlConnection.Open();
            cmd.ExecuteNonQuery();
            sqlConnection.Close();
        }
        catch (Exception ex)
        {
            logger.Trace("Exception in database call: " + ex.ToString());
        }
    }

    public void sitClientWatchDog()
    {
      logger.Trace("Checking Sit Clients");

      while (!StopSitClientWatchDog)
      {
        List<SitClient> sitClients = RetrieveSitClients();
        foreach (SitClient c in sitClients)
        {
          logger.Trace("Checking " + c.Name + " ip: " + c.Ip);
          //if (!c.PingPending)
          //{
            Thread myThread = new Thread(new ThreadStart(() => PingSitClient(c)));
            myThread.Start();
          //}
          //else
          //{
          //  logger.Trace(c.Name + " ping on ip: " + c.Ip + " is still pending");
          //  if((DateTime.Now - c.LastUpdate).TotalMinutes > 1)
          //  {
          //    logger.Trace(c.Name + " " + c.Ip + " has been pending for too long, starting a new ping.");
          //    Thread myThread = new Thread(new ThreadStart(() => PingSitClient(c)));
          //    myThread.Start();
          //  }
          //}
        }
        Thread.Sleep(serverConfigurationManager.RetrieveSitConfiguration().SitClientPingInterval);
      }
    }

    public void PingSitClient(SitClient c)
    {
      //c.PingPending = true;
      //UpdateSitClientPingPending(c);

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

        UpdateSitClientIsUpFlag(c);
        InsertSitClientHistory(c);
      }
      catch (Exception ex)
      {
        logger.Trace("Error in testing " + c.Name + " ip: " + c.Ip + " probably ip was null or invalid");
        //c.PingPending = false;
        c.IsClientUp = false;
        rtdsManager.updateRtdsTag(c.Name, false);
        //UpdateSitClientPingPending(c);
        UpdateSitClientIsUpFlag(c);
        InsertSitClientHistory(c);
      }
    }




  }


}
