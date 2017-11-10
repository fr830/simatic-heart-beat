import { connect } from 'react-redux'
import { getAllClients, setPolling } from '../actions'
import AnalyticsPage from '../components/AnalyticsPage'

const mapStateToProps = (state, ownProps) => ({
  clients: state.clients
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setPolling: (pollingValue, intervalManager) => {
    dispatch(setPolling(pollingValue, intervalManager))
  }
})

const AnalyticsPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalyticsPage)

export default AnalyticsPageContainer
