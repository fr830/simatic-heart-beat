import { connect } from 'react-redux'
import { getAllClientsHistory, setAnalyticsPolling, setPolling } from '../actions'
import GanttChartPage from '../components/GanttChartPage'

const mapStateToProps = (state, ownProps) => ({
  analytics: state.analytics
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  getAllClientsHistory: (fetchingFeedback, startTime, endTime) => {
    dispatch(getAllClientsHistory(fetchingFeedback, startTime, endTime))
  },
  setAnalyticsPolling: (pollingValue, intervalManager) => {
    dispatch(setAnalyticsPolling(pollingValue, intervalManager))
  },
  setPolling: (pollingValue, intervalManager) => {
    dispatch(setPolling(pollingValue, intervalManager))
  },
})

const GanttPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GanttChartPage)

export default GanttPageContainer
