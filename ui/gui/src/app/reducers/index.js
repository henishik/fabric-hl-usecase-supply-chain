import {
  RECIEVE_INITIAL_DATA,
  CREATE_SHIPMENT_ACTION,
  FETCH_ALL_SHIPMENT_LIST_ON_CARRIER,
  UPDATE_SHIPMENT_STATUS
} from '../action';

// import {combineReducers} from 'redux-immutable';
// https://github.com/gajus/redux-immutable
import {combineReducers} from 'redux';
// TODO: figure out why it gets error if it uses import
// import routerReducer from 'react-router-redux';
// using require is fine for 'react-router-redux'
const {routerReducer} = require('react-router-redux');

function shipperReducer(state = {}, action) {
  switch (action.type) {
    case CREATE_SHIPMENT_ACTION:
      console.log(action.data)
      return {
        shipmentList: action.data
      };
    default:
      return state
  }
}

function shipmentListRegulator(state = {}, action) {
  switch (action.type) {
    case RECIEVE_INITIAL_DATA:
      console.log(action.data)
      return {
        shipmentList: action.data
      };
    default:
      return state
  }
}

function shipmentListCarrier(state = {}, action) {
  switch (action.type) {
    case FETCH_ALL_SHIPMENT_LIST_ON_CARRIER:
      return {
        shipmentList: action.data
      };
    case UPDATE_SHIPMENT_STATUS:
      return state;
    default:
      return state
  }
}


const rootReducer = combineReducers({
  shipperReducer,
  shipmentListRegulator,
  shipmentListCarrier,
  routing: routerReducer
});

export default rootReducer;
