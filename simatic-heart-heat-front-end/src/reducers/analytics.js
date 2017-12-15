import configuration from '../configuration'
import _ from 'underscore'

const analytics = (state = configuration.initialState.analytics, action) => {
  switch (action.type) {
    case 'GET_ALL_CLIENTS_HISTORY':
      return {
        ...state, fetching: action.payload.fetchingFeedback
      }
    case 'GET_ALL_CLIENTS_HISTORY_SUCCESS':
      var newState = {...state}
      newState.fetching = false
      newState.clientsHistory.aggregatedByLatency= action.payload.data
      return newState
    case 'GET_ALL_CLIENTS_HISTORY_FAIL':
      return {
        ...state, fetching: false
      }

    default:
      return state
  }
}

export default analytics
