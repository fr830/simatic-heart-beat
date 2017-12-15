import { connect } from 'react-redux'
import { getAllClientsHistory } from '../actions'
import GanttChartPage from '../components/GanttChartPage'

const mapStateToProps = (state, ownProps) => ({
  analytics: state.analytics
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  getAllClientsHistory: (fetchingFeedback, startTime, endTime) => {
    dispatch(getAllClientsHistory(fetchingFeedback, startTime, endTime))
  },
})

const GanttPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GanttChartPage)

export default GanttPageContainer
