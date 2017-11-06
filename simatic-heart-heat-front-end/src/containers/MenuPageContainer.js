import { connect } from 'react-redux'
import MenuPage from '../components/MenuPage'

const mapStateToProps = (state, ownProps) => ({
  state,
  ownProps
})

const mapDispatchToProps = (dispatch, ownProps) => ({

})

const MenuPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuPage)

export default MenuPageContainer
