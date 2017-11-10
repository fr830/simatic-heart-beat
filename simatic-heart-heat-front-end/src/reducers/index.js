import { combineReducers } from 'redux'
import clients from './clients'
import analytics from './analytics'

const mainReducer = combineReducers({
  clients,
  analytics
})

export default mainReducer
