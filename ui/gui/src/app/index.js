import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import configureStore from './configureStore';
// import action from './action';
import RootContainer from './component/organism/rootContainer';
import DLTSupplyChainDemoScreen from './component/organism/DLTSupplyChainDemo';

import '../sass/main.scss';
import ShipperHomeDashboard from './component/organism/ShipperHomeDashboard';
import RegulatorHomeDashboard from './component/organism/RegulatorHomeDashboard';
import CarrerHomeDashboard from './component/organism/CarrerHomeDashboard';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={history}>
        <Route path="/" component={RootContainer}>
          <IndexRoute component={DLTSupplyChainDemoScreen} />
          <Route path="/dlt-supply-chain-demo" component={DLTSupplyChainDemoScreen} />
          <Route path="/shipper-home" component={ShipperHomeDashboard} />
          <Route path="/regulator-home" component={RegulatorHomeDashboard} />
          <Route path="/carrier-home" component={CarrerHomeDashboard} />
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
