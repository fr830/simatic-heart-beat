import { connect } from 'react-redux'
import { getAllClientsHistory } from '../actions'
import LineChartPage from '../components/LineChartPage'

const mapStateToProps = (state, ownProps) => ({
  analytics: state.analytics
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  getAllClientsHistory: (fetchingFeedback, startTime, endTime) => {
    dispatch(getAllClientsHistory(fetchingFeedback, startTime, endTime))
  },
})

const LineChartPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LineChartPage)

export default LineChartPageContainer
