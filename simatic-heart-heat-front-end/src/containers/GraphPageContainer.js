import { connect } from 'react-redux'
import { getAllClientsHistory } from '../actions'
import GraphPage from '../components/GraphPage'

const mapStateToProps = (state, ownProps) => ({
  analytics: state.analytics
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  getAllClientsHistory: (fetchingFeedback) => {
    dispatch(getAllClientsHistory(fetchingFeedback))
  },
})

const GraphPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphPage)

export default GraphPageContainer
