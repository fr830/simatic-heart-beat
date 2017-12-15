const appConfiguration = {
  //serverBaseUrl: "http://192.168.205.94:8080",
  serverBaseUrl: "http://10.45.185.19:8080", //Prod Torrance
  //serverBaseUrl: "http://tre-sit-web-cl1.afsr.mi.valueaddco.com:8080", //Prod Torrance
  //serverBaseUrl: "http://10.45.182.140:8080", //Dev Torrance
  //serverBaseUrl: "http://10.45.186.18:8080", //qa Torrance
  apis: {
    getAllClients: "/api/SitClients/GetAllSitClients",
    getConfiguration: "/api/SitClients/GetConfiguration",
    updatePingInterval: "/api/SitClients/UpdatePingInterval",
    updateClient: "/api/SitClients/EditOrInsertSitClient",
    deleteClient: "/api/SitClients/DeleteSitClient",
    getAllClientsHistory: "/api/SitClients/GetAllSitClientsHistory",
  },
  constants: {
    nodeTypes: [
      {value: 0, displayName: "Simatic Node"},
      {value: 1, displayName: "Network Node"}
    ]
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
    },
    analytics: {
      clientsHistory: {aggregatedByStsate: [], aggregatedByLatency: []},
      fetching: false
    }
  }
}

export default appConfiguration
