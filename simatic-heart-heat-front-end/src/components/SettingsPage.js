import React from 'react'
import {Table, Icon,Form, InputNumber, Input, Button, Anchor, Popconfirm, Radio} from 'antd';
import Moment from 'moment'
import _ from 'underscore'
import configuration from '../configuration'
import md5 from 'md5'
const FormItem = Form.Item;
const { Link } = Anchor;


class SettingsPage extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        number: {
          value: 0,
        },
        newItem: {
          Id: -1,
          Name: "",
          Ip: "",
          NodeType: 0
        },
        editedItem: {
          Id: -1,
          Name: "",
          Ip: ""
        },
        clientList: undefined,
        inputClientValidated: true,
        logged: false
      };
      this.updatePingInterval= this.updatePingInterval.bind(this);
      this.editItem= this.editItem.bind(this);
      this.saveItem= this.saveItem.bind(this);
      this.deleteItem= this.deleteItem.bind(this);
  }

  updatePingInterval = function(){
    this.props.updatePingInterval(this.state.number.value);
  }

  editItem = function(){
    var editedItem = this.state.editedItem
    delete editedItem.actions
    console.log(editedItem);
    this.props.updateClient(editedItem)
    this.setItemEditMode(editedItem, false)
  }

  deleteItem = function(itemToDelete){
    delete itemToDelete.actions
    console.log(itemToDelete);
    this.props.deleteClient(itemToDelete)
  }

  saveItem = function(){
    var editedItem = this.state.newItem
    delete editedItem.actions
    this.props.updateClient(editedItem)
  }

  componentWillMount(){
    this.props.setPolling(false);
    this.props.setAnalyticsPolling(false);
    this.props.getAllClients();
    this.props.getConfiguration();
  }

  componentWillReceiveProps(nextProps){
    var currentPingInterval = this.state.number
    currentPingInterval.value = this.props.clients.configuration.pingInterval
    this.setState({
      clientList: nextProps.clients.clientList,
      number: currentPingInterval,
    });
  }

  validatePrimeNumber = function(number) {
    if (!isNaN(number)) {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: 'It must be a number.',
    };
  }

  handleNumberChange = (value) => {
    this.setState({
      number: {
        ...this.validatePrimeNumber(value),
        value,
      },
    });
  }

  handleSitClientNameEdit = (event, c) => {
    var currentEditedItem = this.state.editedItem;
    currentEditedItem.Name = event.target.value

    this.setState({
      editedItem: currentEditedItem,
    });

  }

  handleSitClientIPEdit = (event, c) => {
    var currentEditedItem = this.state.editedItem;
    currentEditedItem.Ip = event.target.value
    this.setState({
      editedItem: currentEditedItem,
    });
  }

  handleSitClientNodeTypeEdit = (event, c) => {
    var currentEditedItem = this.state.editedItem;
    currentEditedItem.NodeType = event.target.value
    if(c){
      c.NodeType = event.target.value
    }
    this.setState({
      editedItem: currentEditedItem
    });
  }

  handleSitClientNameChange = (event) => {
    var currentNewItem = this.state.newItem;
    var inputClientValidated = true;
    currentNewItem.Name = event.target.value
    if(currentNewItem.Name.length > 0 && currentNewItem.Ip.length > 0){
      inputClientValidated = false
    }
    this.setState({
      editedItem: currentNewItem,
      inputClientValidated
    });
  }

  handlePasswordChange = (event) => {
    if(md5(event.target.value) == "25422d0f3b2f8898e5d6698e0fa59521"){
      this.props.login()
    }
  }

  handleSitClientIPChange = (event) => {
    var currentNewItem = this.state.newItem;
    var inputClientValidated = true;
    currentNewItem.Ip = event.target.value
    if(currentNewItem.Name.length > 0 && currentNewItem.Ip.length > 0){
      inputClientValidated = false
    }
    this.setState({
      newItem: currentNewItem,
      inputClientValidated
    });
  }

  handleSitClientNodeTypeChange = (event) => {
    var currentNewItem = this.state.newItem;
    currentNewItem.NodeType = event.target.value
    this.setState({
      newItem: currentNewItem
    });
  }

  setItemEditMode = function(c, isEditMode){
    var clientList = this.state.clientList;
    this.setState({
      clientList: clientList.map(function(client){
        if(c.Id == client.Id){
          this.setState({
            editedItem: {...c}
          })
          client.inEditMode = isEditMode
          return client
        }else{
          client.inEditMode = false
          return client
        }
      }.bind(this))
    })
  }

  renderClients = function(){
    var columns = [{
      title: 'Name',
      dataIndex: 'customName',
      sorter: (a,b) => a.Name > b.Name ? 1 : -1,
    },
    {
      title: 'IP Address',
      dataIndex: 'customIp',
      sorter: (a,b) => a.Ip > b.Ip ? 1 : -1,
    },
    {
      title: 'Node Type',
      dataIndex: 'customNodeType',
      //sorter: (a,b) => a.Ip > b.Ip ? 1 : -1,
    },{
      title: 'Creation Date',
      dataIndex: 'Date',
      sorter: (a,b) => a.CreationDate > b.CreationDate ? 1 : -1,
    },{
      title: '',
      dataIndex: 'actions',
      width: '20%',
    }]
    var data = []
    if(this.state.clientList){
      data= this.state.clientList.map(function(c, i){
       c.key = i;

       c.Date = Moment(c.CreationDate).format('h:mm:ss a M/D');

       if(c.inEditMode){
         c.customName = <Input
           onChange={(value) => this.handleSitClientNameEdit(value, c)}
           prefix={<Icon type="hdd" style={{ fontSize: 13 }} />} placeholder="Hostname"
           value={this.state.editedItem.Name}
         />
         c.customIp = <Input
           onChange={(value) => this.handleSitClientIPEdit(value, c)}
           prefix={<Icon type="cloud" style={{ fontSize: 13 }} />} placeholder="127.0.0.1"
           value={this.state.editedItem.Ip}
         />
         c.customNodeType = <Radio.Group value={c.NodeType} onChange={(value) => this.handleSitClientNodeTypeEdit(value, c)}>
          {configuration.constants.nodeTypes.map((n, i) => <Radio.Button key={i} value={n.value}>{n.displayName}</Radio.Button>)}
        </Radio.Group>
         c.actions = <span>
                       <Button type="primary" className="button-spaging-horizontal" onClick={this.editItem}>Save</Button>
                       <Button type="default" className="button-spaging-horizontal" onClick={()=>this.setItemEditMode(c, false)}>Cancel</Button>
                     </span>
       }else{
         c.actions = <span>
                       <Button type="default" className="button-spaging-horizontal" onClick={()=>this.setItemEditMode(c, true)}>Edit</Button>
                       <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteItem(c)}>
                         <Button type="danger" className="button-spaging-horizontal">Delete</Button>
                       </Popconfirm>
                     </span>
         c.customName = c.Name
         c.customIp = c.Ip
         c.customNodeType = configuration.constants.nodeTypes[c.NodeType].displayName
       }
       return c
     }.bind(this))
    }

    return <Table columns={columns} dataSource={data} pagination={false} className="table" loading={this.props.clients.fetching}/>
  }



  render() {
    const formItemLayout = {
          labelCol: { span: 12 },
          wrapperCol: { span: 12 },
        };
    const formItemLayout2 = {
          labelCol: { span: 9 },
          wrapperCol: { span: 9 },
        };
    const number = this.state.number;
    const tips = 'Enter a number in miliseconds.';

    return (
      <div>
      {!this.props.clients.logged &&
        <div>
          <div className="section-1-header" id="clients">
            <span className="text-spacing">LOG IN</span>
          </div>
          <div className="section-1 align-center">
            <Input
              className="input-width-small inline-block "
              type="password"
              onChange={this.handlePasswordChange}
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="password"
            />
          </div>
        </div>
      }


        {this.props.clients.logged && <div>
          <br/>
        <Button onClick={this.props.logout}>Logout</Button>

        <div className="section-1-header" id="clients">
          <span className="text-spacing">SERVER CONFIGURATION</span>
        </div>
        <div className="section-1" id="ping-timeout">
          <Form layout="inline" className="align-center">
            <FormItem
              label="Ping interval"
              validateStatus={number.validateStatus}
              help={number.errorMsg || tips}
            >
              <InputNumber
                value={number.value}
                onChange={this.handleNumberChange}
              />

            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="button-spaging-horizontal" loading={this.props.clients.configuration.fetchingPingInterval} onClick={this.updatePingInterval}>
                Submit
              </Button>
            </FormItem>
          </Form>
        </div>


        <div className="section-1-header" id="clients">
          <span className="text-spacing">SIT CLIENT CONFIGURATION</span>
        </div>
        <div className="section-1" id="clients">

          <Form layout="inline" className="align-center">
            <FormItem
              label="SitClient Name"
            >
              <Input
                onChange={this.handleSitClientNameChange}
                prefix={<Icon type="hdd" style={{ fontSize: 13 }} />} placeholder="Hostname"
                value={this.state.newItem.Name}
              />
            </FormItem>
            <FormItem
              label="SitClient IP"
            >
              <Input
                onChange={this.handleSitClientIPChange}
                value={this.state.newItem.Ip}
                prefix={<Icon type="cloud" style={{ fontSize: 13 }} />} placeholder="127.0.0.1"
              />
            </FormItem>
            <FormItem>
              <Radio.Group value={this.state.newItem.NodeType} onChange={this.handleSitClientNodeTypeChange}>
               {configuration.constants.nodeTypes.map((n, i) => <Radio.Button key={i} value={n.value}>{n.displayName}</Radio.Button>)}
             </Radio.Group>
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="button-spaging-horizontal" onClick={this.saveItem} disabled={this.state.inputClientValidated}>
                Add new client
              </Button>
            </FormItem>
          </Form>

          {this.renderClients()}
        </div>
      </div>}
      </div>
    );
  }
}

export default SettingsPage
