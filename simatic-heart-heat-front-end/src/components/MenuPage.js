import React from 'react'
import {Menu, Icon} from 'antd';
import {
Link,
BrowserRouter as Router,
} from 'react-router-dom'

class ClientsPage extends React.Component {

  state = {
      current: 'network',
    }
    handleClick = (e) => {
      this.setState({
        current: e.key,
      });
    }

    componentWillReceiveProps(nextProps){
      var splittedUrl = window.location.href.split("/")
      if(splittedUrl.length >= 4 ){
        if(window.location.href.split("/")[3].length > 1){
          this.setState({current: window.location.href.split("/")[3]})
        }
      }
    }

  render() {
    return (
      <div>
          <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
          >
            <Menu.Item key="network">
              <Link to="/network"><Icon type="cloud" />Network</Link>
            </Menu.Item>
            <Menu.Item key="analytics">
            <Link to="/analytics"><Icon type="area-chart" />Analytics</Link>
            </Menu.Item>
            <Menu.Item key="settings">
            <Link to="/settings"><Icon type="setting" />Settings</Link>
            </Menu.Item>
          </Menu>
      </div>
    );
  }
}

export default ClientsPage
