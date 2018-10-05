import React from 'react'
import {Table, Spin, Icon, Tag} from 'antd';
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
    //console.log('params', pagination, filters, sorter);
  }

  componentWillMount(){
    if(!this.props.clients.polling){
      var intervalManager = setInterval(function(){ this.props.getAllClients(false); }.bind(this), 1000);
      this.props.setPolling(true, intervalManager);
    }
  }

  statusSorter(a,b){
    var result = 1

    if(!a.IsClientUp && b.IsClientUp){
      result = -1
    }

    if(Moment().diff(Moment(b.LastHeartBeat), "minutes") < 10){
      result = -1
    }

    return result
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
      //sorter: this.statusSorter
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
      var networkNodeElement = undefined
      var simaticNodeElement = undefined

      if(c.NodeType == 0){
        if (c.Name == 'testServer') {
          console.log(c.Name + " " + c.LastHeartBeat);
          console.log(Moment().diff(Moment(c.LastHeartBeat), "seconds"));
        }
        
        if(Moment().diff(Moment(c.LastHeartBeat), "seconds") > 30 ){
          simaticNodeElement = <Tag color="red" className="tag">Simatic Closed</Tag>
        }else{
          simaticNodeElement = <Tag color="green" className="tag">Simatic Open</Tag>
        }
      }

      if(c.IsClientUp){
        networkNodeElement = <Tag color="#27ae60" className="tag">Node up</Tag>
      }else{
        networkNodeElement = <Tag color="#c0392b" className="tag">Node down</Tag>
      }

      c.State = <span>
        {networkNodeElement}
        <br/>
        {simaticNodeElement}
      </span>

      return c
    }.bind(this)).sort((a,b) => a.IsClientUp ? 1 : -1)

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
