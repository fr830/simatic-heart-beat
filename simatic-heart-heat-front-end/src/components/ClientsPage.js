import React from 'react'
import {Table, Spin, Icon} from 'antd';
import Moment from 'moment'
import _ from 'underscore'
import {detect} from 'detect-browser'

class ClientsPage extends React.Component {

  constructor(props) {
    super(props);
    var isNotChrome = false
    if(detect()){
      if(detect().name != "chrome"){
        isNotChrome = true
      }
    }
    this.state = {isNotChrome};
  }

  onChange = function(pagination, filters, sorter) {
    console.log('params', pagination, filters, sorter);
  }

  componentWillMount(){
    if(!this.props.clients.polling){
      var intervalManager = setInterval(function(){ this.props.getAllClients(false); }.bind(this), 1000);
      this.props.setPolling(true, intervalManager);
    }
  }

  renderClients = function(){
    var columns = [{
      title: 'Name',
      dataIndex: 'Name',
      sorter: (a,b) => a.Name > b.Name ? 1 : -1,
    },
    {
      title: 'IP Address',
      dataIndex: 'Ip',
      sorter: (a,b) => a.Ip > b.Ip ? 1 : -1,
      className: "wide-screen-only"
    },{
      title: 'State',
      dataIndex: 'State',
      sorter: (a,b) => a.IsClientUp ? 1 : -1,
    },{
      title: 'Latency',
      dataIndex: 'PingRoundTripTime',
      sorter: (a,b) => a.PingRoundTripTime > b.PingRoundTripTime ? 1 : -1,
      className: "wide-screen-only"
    },{
      title: 'Last Update',
      dataIndex: 'Date',
      className: "wide-screen-only"
    }]

    var data = this.props.clients.clientList.map(function(c, i){
      c.key = i;

      c.Date = Moment(c.LastUpdate).format('h:mm:ss a M/D');

      if(c.PingPending){
        if(this.state.isNotChrome){
          c.State = "Pinging..."
        }else{
          c.State = <Icon type="loading" style={{ fontSize: 20}}/>
        }
      }else{
        if(this.state.isNotChrome){
          c.State = c.IsClientUp ? <span className="green">Up</span> : <span className="red"> Down </span>
        }else{
          c.State = c.IsClientUp ? <Icon type="check-circle" style={{ fontSize: 20, color: '#27ae60' }}/> : <Icon type="close-circle" style={{ fontSize: 20, color: '#e74c3c' }}/>
        }
      }

      return c
    }.bind(this)).sort((a, b) => a.IsClientUp ? 1 : -1)

    return <Table columns={columns} dataSource={data} pagination={false} className="table"/>
  }

  render() {
    return (
      <div>
      {this.renderClients()}
      </div>
    );
  }
}

export default ClientsPage
