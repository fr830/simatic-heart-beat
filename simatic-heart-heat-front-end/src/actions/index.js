import configuration from '../configuration'
import axios from 'axios'
import store from '../index';
//method: 'post',

export const getAllClients = (fetchingFeedback = true) => ({
  type: 'GET_ALL_CLIENTS',
  payload: {
      request:{
        url: configuration.apis.getAllClients
      },
      fetchingFeedback
    }
})

export const getAllClientsHistory = function(fetchingFeedback = true, startTime, endTime){
  if(store != undefined && store.getState().analytics.requestPending){
    console.log("request pending");
    return {
      type: 'GET_ALL_CLIENTS_HISTORY_ABORT',
      payload: {}
    }
  }

  var et = undefined
  if(endTime){
    et = endTime.format('YYYY-MM-DDTHH:mm:ss')
  }
  var st = undefined
  if(startTime){
    st = startTime.format('YYYY-MM-DDTHH:mm:ss')
  }

  return{
    type: 'GET_ALL_CLIENTS_HISTORY',
    payload: {
        request:{
          url: configuration.apis.getAllClientsHistory,
          method: 'post',
          data: {startTime: st, endTime:et}
        },
        fetchingFeedback
            }
  }
}

export const login = () => ({
  type: 'LOGIN',
  payload: {}
})

export const logout = () => ({
  type: 'LOGOUT',
  payload: {}
})


export const getConfiguration = () => ({
  type: 'GET_CONFIGURATION',
  payload: {
      request:{
        url: configuration.apis.getConfiguration
      },
    }
})

export const updatePingInterval = (newPingInterval) => ({
  type: 'UPDATE_PING_INTERVAL',
  payload: {
      request:{
        url: configuration.apis.updatePingInterval,
        method: 'post',
        data: {SitClientPingInterval:newPingInterval}
      },
      newPingInterval
    }
})

/*
export const updateClient = (newClient) => ({
  type: 'UPDATE_CLIENT',
  payload: {
      request:{
        url: configuration.apis.updateClient,
        method: 'post',
        data: newClient
      },
      newClient
    }
})
*/
export const updateClientLocal = (newClient) => ({
  type: 'UPDATE_CLIENT',
  payload: {
      newClient
    }
})
export const updateClientSuccessLocal = (newClient) => ({
  type: 'UPDATE_CLIENT_SUCCESS',
  payload: {
      newClient
    }
})
export const updateClientFailLocal = (newClient) => ({
  type: 'UPDATE_CLIENT_FAIL',
  payload: {
      newClient
    }
})

export const updateClient = function(newClient, dispatcher){
  axios.post(configuration.serverBaseUrl + configuration.apis.updateClient, newClient)
  .then(function (response) {
    dispatcher({ type: 'UPDATE_CLIENT_SUCCESS', payload: { newClient } })
    dispatcher({ type: 'GET_ALL_CLIENTS', payload: { request:{ url: configuration.apis.getAllClients }, fetchingFeedback: false } })
  })
  .catch(function (error) {
    dispatcher({ type: 'UPDATE_CLIENT_FAIL', payload: { newClient } })
  });
  return { type: 'UPDATE_CLIENT', payload: { newClient } }
}

export const deleteClient = (clientToDelete) => ({
  type: 'DELETE_CLIENT',
  payload: {
      request:{
        url: configuration.apis.deleteClient,
        method: 'post',
        data: clientToDelete
      },
      clientToDelete
    }
})

export const setPolling = (pollingValue, intervalManager) => ({
  type: 'SET_POLLING',
  payload: {
      pollingValue,
      intervalManager
    }
})

export const setAnalyticsPolling = (pollingValue, intervalManager) => ({
  type: 'SET_ANALYTICS_POLLING',
  payload: {
      pollingValue,
      intervalManager
    }
})
