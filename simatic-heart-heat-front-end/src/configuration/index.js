const appConfiguration = {
  serverBaseUrl: "http://192.168.205.94:8080",
  //serverBaseUrl: "http://10.45.185.19:8080",
  apis: {
    getAllClients: "/api/SitClients/GetAllSitClients",
    getConfiguration: "/api/SitClients/GetConfiguration",
    updatePingInterval: "/api/SitClients/UpdatePingInterval",
    updateClient: "/api/SitClients/EditOrInsertSitClient",
    deleteClient: "/api/SitClients/DeleteSitClient"
  },
  initialState: {
    clients: {
      clientList: [],
      fetching: false,
      polling: false,
      intervalManager: undefined,
      insertingNewClient: false,
      updatingClient: false,
      configuration: {
        fetchingPingInterval: false,
        pingInterval: 0
      }
    }
  }
}

export default appConfiguration
