import configuration from '../configuration'
import _ from 'underscore'

const analytics = (state = configuration.initialState.analytics, action) => {
  switch (action.type) {
    case 'GET_ALL_CLIENTS_HISTORY':
      return {
        ...state, fetching: action.payload.fetchingFeedback
      }
    case 'GET_ALL_CLIENTS_HISTORY_SUCCESS':
      return {
        ...state, fetching: false, clientsHistory: action.payload.data
      }
    case 'GET_ALL_CLIENTS_HISTORY_FAIL':
      return {
        ...state, fetching: false
      }

    default:
      return state
  }
}

export default analytics
