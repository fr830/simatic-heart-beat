import { connect } from 'react-redux'
import { getAllClients, setPolling } from '../actions'
import ClientsPage from '../components/ClientsPage'

const mapStateToProps = (state, ownProps) => ({
  clients: state.clients
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  getAllClients: (fetchingFeedback) => {
    dispatch(getAllClients(fetchingFeedback))
  },
  setPolling: (pollingValue, intervalManager) => {
    dispatch(setPolling(pollingValue, intervalManager))
  }
})

const ClientsPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientsPage)

export default ClientsPageContainer
