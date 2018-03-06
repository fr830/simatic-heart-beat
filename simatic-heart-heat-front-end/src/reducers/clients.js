import configuration from '../configuration'
import _ from 'underscore'

const clients = (state = configuration.initialState.clients, action) => {
  switch (action.type) {
    case 'GET_ALL_CLIENTS':
      return {
        ...state, fetching: action.payload.fetchingFeedback
      }
    case 'GET_ALL_CLIENTS_SUCCESS':
      return {
        ...state, fetching: false, clientList: action.payload.data
      }
    case 'GET_ALL_CLIENTS_FAIL':
      return {
        ...state, fetching: false
      }

    case 'GET_CONFIGURATION_SUCCESS':
      var newState = {...state}
      newState.configuration.pingInterval = action.payload.data.SitClientPingInterval
      return newState

    case 'UPDATE_PING_INTERVAL':
      var newState = {...state}
      newState.configuration.fetchingPingInterval = true
      newState.configuration.pingInterval = action.payload.newPingInterval
      return newState
    case 'UPDATE_PING_INTERVAL_SUCCESS':
      var newState = {...state}
      newState.configuration.fetchingPingInterval = false
      return newState
    case 'UPDATE_PING_INTERVAL_FAIL':
      var newState = {...state}
      newState.configuration.fetchingPingInterval = false
      return newState

    case 'UPDATE_CLIENT':
      var newState = {...state}
      newState.fetching = true
      if(action.payload.newClient.Id == -1){
        var itemToAdd = {...action.payload.newClient}
        itemToAdd.Id = Math.random()
        newState.clientList.push(itemToAdd)
      }else{
        newState.clientList.map(function(c){
          if(c.Id == action.payload.newClient.Id){
            c.Name = action.payload.newClient.Name
            c.Ip = action.payload.newClient.Ip
          }else{
            return c
          }
        })
      }
      return newState
    case 'UPDATE_CLIENT_SUCCESS':
      var newState = {...state}
      newState.fetching = false
      return newState
    case 'UPDATE_CLIENT_FAIL':
      var newState = {...state}
      newState.fetching = false
      return newState

    case 'DELETE_CLIENT':
      var newState = {...state}
      newState.fetching = true
      newState.clientList = newState.clientList.filter(function(c) {
          return c.Id !== action.payload.clientToDelete.Id;
      });
      return newState
    case 'DELETE_CLIENT_SUCCESS':
      var newState = {...state}
      newState.fetching = false
      return newState
    case 'DELETE_CLIENT_FAIL':
      var newState = {...state}
      newState.fetching = false
      return newState

    case 'SET_POLLING':
      if(action.payload.pollingValue == false){
        if(state.intervalManager){
          clearInterval(state.intervalManager)
        }
      }
      return {
        ...state, polling: action.payload.pollingValue, intervalManager: action.payload.intervalManager
      }

    case 'LOGIN':
      return {
        ...state, logged: true
      }

      case 'LOGOUT':
        return {
          ...state, logged: false
        }


    default:
      return state
  }
}

export default clients
