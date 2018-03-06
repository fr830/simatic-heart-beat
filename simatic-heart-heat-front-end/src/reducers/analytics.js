import configuration from '../configuration'
import _ from 'underscore'

const analytics = (state = configuration.initialState.analytics, action) => {
  switch (action.type) {
      case 'GET_ALL_CLIENTS_HISTORY':
      var newState = {...state}
      if(action.payload.fetchingFeedback){
        newState.fetching = true
      }
      newState.requestPending = true
      return newState
    case 'GET_ALL_CLIENTS_HISTORY_SUCCESS':
      var newState = {...state}
      newState.fetching = false
      newState.requestPending = false
      newState.clientsHistory.aggregatedByLatency= action.payload.data
      return newState
    case 'GET_ALL_CLIENTS_HISTORY_FAIL':
      return {
        ...state, fetching: false, requestPending: false
      }

    case 'SET_ANALYTICS_POLLING':
      if(action.payload.pollingValue == false){
        if(state.intervalManager){
          clearInterval(state.intervalManager)
        }
      }
      return {
        ...state, polling: action.payload.pollingValue, intervalManager: action.payload.intervalManager
      }

    default:
      return state
  }
}

export default analytics
