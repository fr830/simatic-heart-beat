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
    public class SitClientsRepository
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["CleintsDatabase"].ConnectionString;
        private static Logger logger = LogManager.GetCurrentClassLogger();

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
	                    CreationDate datetime NULL
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

        public List<SitClient> RetrieveSitClientsHistory()
        {
            List<SitClient> sitClients = new List<SitClient>();

            SqlCommand command;
            string sql = null;
            SqlDataReader dataReader;
            sql = @"select * from SitClientsHistory";

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
                    if (!dataReader.IsDBNull(4)) { sitClientToAdd.IsClientUp = Convert.ToBoolean(dataReader.GetValue(4)); }
                    if (!dataReader.IsDBNull(5)) { sitClientToAdd.PingRoundTripTime = Convert.ToInt32(dataReader.GetValue(5)); }
                    if (!dataReader.IsDBNull(6)) { sitClientToAdd.LastUpdate = Convert.ToDateTime(dataReader.GetValue(6)); }

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

        public SitClient RetrieveSitClient(string argument)
        {
            List<SitClient> sitClients = RetrieveSitClients();
            var sitClient = sitClients.FirstOrDefault((p) => p.Name == argument);
            return sitClient;
        }

        public void UpdateSitClientHeartBeat(SitClient clientToUpdate)
        {
            SqlConnection sqlConnection = new SqlConnection(connectionString);
            DateTime timestamp = DateTime.Now;

            SqlCommand cmd = new SqlCommand();
            cmd.CommandType = System.Data.CommandType.Text;
            try
            {
                if (RetrieveSitClient(clientToUpdate.Name) != null)
                {
                    logger.Trace("Updating HeartBeat for client name: " + clientToUpdate.Name + ", HeartBeat: " + timestamp.ToString());
                    cmd.CommandText = "Update SitClients set LastHeartBeat = '" + timestamp.ToString() + "' , LastUpdate = '" + timestamp.ToString() + "' where Name = '" + clientToUpdate.Name + "'";
                }
                else
                {
                    logger.Trace("Inserting client name: " + clientToUpdate.Name + ", HeartBeat: " + timestamp.ToString());
                    cmd.CommandText = "INSERT SitClients (Name, LastHeartBeat) VALUES ('" + clientToUpdate.Name + "', '" + timestamp.ToString() + "')";
                }

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

        public void EditOrInsertSitClient(SitClient clientToUpdate)
        {
            SqlConnection sqlConnection = new SqlConnection(connectionString);
            DateTime timestamp = DateTime.Now;

            SqlCommand cmd = new SqlCommand();
            string sql = "";
            cmd.CommandType = System.Data.CommandType.Text;
            try
            {
                if(clientToUpdate.Id >= 0)
                {
                    sql = "Update SitClients set Ip = '" + clientToUpdate.Ip + "', Name = '" + clientToUpdate.Name + "', LastUpdate = '" + timestamp.ToString() + "', PingPending = 0 where Id = '" + clientToUpdate.Id + "'";
                }
                else
                {
                    sql = "insert into SitClients (Name, Ip, IsCLientUp, PingRoundTripTime, LastUpdate, PingPending, CreationDate) values ('" + clientToUpdate.Name + "', '" + clientToUpdate.Ip + "', 0, 0, '" + timestamp.ToString() + "', 0, '" + timestamp.ToString() + "')";
                }
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

        public void DeleteSitClient(SitClient clientToDelete)
        {
            SqlConnection sqlConnection = new SqlConnection(connectionString);

            SqlCommand cmd = new SqlCommand();
            string sql = "";
            cmd.CommandType = System.Data.CommandType.Text;
            try
            {

                sql = "DELETE FROM SitClients WHERE Id = " + clientToDelete.Id;
                
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

        public List<SitClient> RetrieveDisconnectedSitClientsBrowser()
        {
            List<SitClient> sitClients = new List<SitClient>();

            SqlCommand command;
            string sql = null;
            SqlDataReader dataReader;

            DateTime expirationTime = DateTime.Now;
            int expirationTimeout = Convert.ToInt32(ConfigurationSettings.AppSettings["expirationTimeout"]);
            expirationTime = expirationTime.AddMinutes(-expirationTimeout);

            sql = @"select Id, Name, Ip, LastHeartBeat from SitClients where LastHeartBeat < '" + expirationTime.ToString("yyyy-MM-dd HH:mm:ss.fff") + "'";
            logger.Trace("Checking disconnected clients browser: " + sql);
            SqlConnection cnn;
            cnn = new SqlConnection(connectionString);
            try
            {
                cnn.Open();
                command = new SqlCommand(sql, cnn);
                dataReader = command.ExecuteReader();
                while (dataReader.Read())
                {
                    sitClients.Add(
                        new SitClient
                        {
                            Id = Convert.ToInt32(dataReader.GetValue(0)),
                            Name = Convert.ToString(dataReader.GetValue(1)),
                            Ip = Convert.ToString(dataReader.GetValue(2)),
                            LastHeartBeat = Convert.ToDateTime(dataReader.GetValue(3))
                        }
                        );
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

    }
}