import fetch from 'isomorphic-fetch';

export const ASSIGN_CARRIER = 'ASSIGN_CARRIER';
export const assignCarrier = (target_shipment_id) => dispatch => {
  console.log(target_shipment_id)
  fetch('http://localhost:9998/api/shipment/assigncarrier/' + target_shipment_id)
  .then(response => response.json())
  .then(json => dispatch({
    type: CREATE_SHIPMENT_ACTION,
    data: json
  }));
};

export const AUTHORIZE_TRANSACTION = 'AUTHORIZE_TRANSACTION';
export const authorizeTransaction = (target_shipment_id, current_status) => dispatch => {
  fetch('http://localhost:9998/api/shipment/status/update/' + target_shipment_id + '/' + current_status)
  .then(response => response.json())
  .then(json => dispatch({
    type: AUTHORIZE_TRANSACTION,
    data: json
  }));
};

export const UPDATE_SHIPMENT_STATUS_ON_SHIPPER = 'UPDATE_SHIPMENT_STATUS';
export const updateShipmentStatusOnShipper = (target_shipment_id, current_status) => dispatch => {
  fetch('http://localhost:9998/api/shipment/status/update/' + target_shipment_id + '/' + current_status)
  .then(response => response.json())
  .then(json => dispatch({
    type: UPDATE_SHIPMENT_STATUS_ON_SHIPPER,
    data: json
  }));
};

export const UPDATE_SHIPMENT_STATUS = 'UPDATE_SHIPMENT_STATUS';
export const updateShipmentStatusOnCarrier = (target_shipment_id, current_status) => dispatch => {
  console.log(target_shipment_id)
  console.log(current_status)

  fetch('http://localhost:9998/api/shipment/status/update/' + target_shipment_id + '/' + current_status)
  .then(response => response.json())
  .then(json => dispatch({
    type: UPDATE_SHIPMENT_STATUS,
    data: json
  }));
};

export const MAKE_PAYMENT = 'MAKE_PAYMENT';
export const makePayment = (target_shipment_id, current_shipment_status) => dispatch => {
  fetch('http://localhost:9998/api/shipment/status/update/' + target_shipment_id + '/' + current_shipment_status)
  .then(response => response.json())
  .then(json => dispatch({
    type: MAKE_PAYMENT,
    data: json
  }));
};

export const CREATE_SHIPMENT_ACTION = 'CREATE_SHIPMENT_ACTION';
export const createShipment = () => dispatch => {
  fetch('http://localhost:9998/api/shipment/create')
  .then(response => response.json())
  .then(json => dispatch({
    type: CREATE_SHIPMENT_ACTION,
    data: json
  }));
};

export const RECIEVE_INITIAL_DATA = 'RECIEVE_INITIAL_DATA';
export const fetchInitialData = () => dispatch => {
  fetch('http://localhost:9998/api/list/shipment')
  .then(response => response.json())
  .then(json => dispatch({
    type: RECIEVE_INITIAL_DATA,
    data: json
  }));
};

export const FETCH_ALL_SHIPMENT_LIST_ON_SHIPPER = 'FETCH_ALL_SHIPMENT_LIST_ON_SHIPPER';
export const fetchAllShipmentListOnShipper = (shipper_id) => dispatch => {
  console.log()
  fetch('http://localhost:9998/api/shipment/list/shipper/' + shipper_id)
  .then(response => response.json())
  .then(json => dispatch({
    type: FETCH_ALL_SHIPMENT_LIST_ON_SHIPPER,
    data: json
  }));
};

export const FETCH_ALL_SHIPMENT_LIST_ON_CARRIER = 'FETCH_ALL_SHIPMENT_LIST_ON_CARRIER';
export const fetchAllShipmentListOnCarrier = () => dispatch => {
  fetch('http://localhost:9998/api/shipment/list/carrier')
  .then(response => response.json())
  .then(json => dispatch({
    type: FETCH_ALL_SHIPMENT_LIST_ON_CARRIER,
    data: json
  }));
};

export const LOG_SHIPMENT_LOCATION = 'LOG_SHIPMENT_LOCATION';
export const logShipmentLocation = (shipment_id) => dispatch => {
  fetch('http://localhost:9998/api/location/log/' + shipment_id)
  .then(response => response.json())
  .then(json => dispatch({
    type: LOG_SHIPMENT_LOCATION,
    data: json
  }));
};