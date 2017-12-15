import React from 'react'
import {Table, Spin, Icon} from 'antd';
import Moment from 'moment'
import _ from 'underscore'
import {detect} from 'detect-browser'
import GanttPageContainer from '../containers/GanttPageContainer'
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
      <GanttPageContainer/>
      </div>
    );
  }
}

export default AnalyticsPage
