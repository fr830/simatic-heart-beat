import { connect } from 'react-redux'
import { getAllClients, getConfiguration, updatePingInterval, setPolling, updateClient, deleteClient } from '../actions'
import SettingsPage from '../components/SettingsPage'

const mapStateToProps = (state, ownProps) => ({
  clients: state.clients,
  configuration: state.configuration
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  getAllClients: () => {
    dispatch(getAllClients())
  },
  getConfiguration: () => {
    dispatch(getConfiguration())
  },
  updatePingInterval: (newPingInterval) => {
    dispatch(updatePingInterval(newPingInterval))
  },
  updateClient: (newClient) => {
    dispatch(updateClient(newClient, dispatch))
  },
  deleteClient: (clientToDelete) => {
    dispatch(deleteClient(clientToDelete))
  },
  setPolling: (pollingValue, intervalManager) => {
    dispatch(setPolling(pollingValue, intervalManager))
  }
})

const SettingsPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPage)

export default SettingsPageContainer
