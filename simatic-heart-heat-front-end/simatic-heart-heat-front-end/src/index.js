import 'core-js/fn/string/starts-with';
import 'core-js/fn/string/includes';
import 'core-js/fn/array/includes';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux'
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import reducer from './reducers'
import { Provider } from 'react-redux'
import configuration from './configuration'
import logger from 'redux-logger'

const client = axios.create({ //all axios can be used, shown in axios documentation
  baseURL: configuration.serverBaseUrl,
  responseType: 'json'
});

const store = createStore(reducer, configuration.initialState, applyMiddleware(logger, axiosMiddleware(client)))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
