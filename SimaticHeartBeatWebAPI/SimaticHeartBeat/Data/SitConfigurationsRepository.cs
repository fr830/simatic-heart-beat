using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using SimaticHeartBeat.Models;
using System.Data.SqlClient;
using System.Collections.Specialized;
using NLog;

namespace SimaticHeartBeat.Data
{
    public class SitConfigurationsRepository
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["CleintsDatabase"].ConnectionString;
        private static Logger logger = LogManager.GetCurrentClassLogger();

    public void checkConfigurationsEntities()
    {
      SqlConnection sqlConnection = new SqlConnection(connectionString);

      SqlCommand cmd = new SqlCommand();
      string sql = "";
      cmd.CommandType = System.Data.CommandType.Text;
      try
      {
        sql = @"if not exists (select * from sysobjects where name='Configuration' and xtype='U')
                begin
	                CREATE TABLE Configuration( SitClientPingInterval int )
	                insert into Configuration (SitClientPingInterval) values (10000)
                end";

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

    public ServerConfiguration RetrieveSitConfiguration()
        {
            ServerConfiguration configuration = new ServerConfiguration();

            SqlCommand command;
            string sql = null;
            SqlDataReader dataReader;
            sql = @"select * from Configuration";

            SqlConnection cnn;
            cnn = new SqlConnection(connectionString);
            try
            {
                cnn.Open();
                command = new SqlCommand(sql, cnn);
                dataReader = command.ExecuteReader();
                while (dataReader.Read())
                {
                    if (!dataReader.IsDBNull(0)) { configuration.SitClientPingInterval = Convert.ToInt32(dataReader.GetValue(0)); }
                }
                dataReader.Close();
                command.Dispose();
                cnn.Close();

            }
            catch (Exception ex)
            {
                logger.Trace("Exception in database call: " + ex.ToString());
            }

            return configuration;
        }


        public void UpdateSitClientSitClientPingInterval(ServerConfiguration configurationToUpdate)
        {
            SqlConnection sqlConnection = new SqlConnection(connectionString);
            DateTime timestamp = DateTime.Now;

            SqlCommand cmd = new SqlCommand();
            string sql = "";
            try
            {
                sql = "Update Configuration set SitClientPingInterval = " + configurationToUpdate.SitClientPingInterval;
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

    }
}