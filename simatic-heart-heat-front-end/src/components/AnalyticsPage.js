import React from 'react'
import {Table, Spin, Icon} from 'antd';
import Moment from 'moment'
import _ from 'underscore'
import {detect} from 'detect-browser'
import GraphPageContainer from '../containers/GraphPageContainer'
class AnalyticsPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount(){
    this.props.setPolling(false);
  }


  render() {
    return (
      <div>
      <GraphPageContainer/>
      </div>
    );
  }
}

export default AnalyticsPage
