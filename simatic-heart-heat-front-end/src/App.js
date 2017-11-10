import React, { Component } from 'react';
import './App.css';
import {LocaleProvider} from 'antd';
import ClientsPageContainer from './containers/ClientsPageContainer';
import AnalyticsPageContainer from './containers/AnalyticsPageContainer';
import SettingsPageContainer from './containers/SettingsPageContainer';
import MenuPageContainer from './containers/MenuPageContainer';
import enUS from 'antd/lib/locale-provider/en_US';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

class App extends Component {

  render() {
    return (
      <LocaleProvider locale={enUS}>
        <Router>
          <div className="App">
            <MenuPageContainer></MenuPageContainer>
            <div className="page-body">
              <Switch>
                <Route exact path="/" component={ClientsPageContainer}/>
                <Route path="/network" component={ClientsPageContainer}/>
                <Route path="/analytics" component={AnalyticsPageContainer}/>
                <Route path="/settings" component={SettingsPageContainer}/>
              </Switch>
            </div>
          </div>
        </Router>
      </LocaleProvider>
    );
  }
}

export default App;
