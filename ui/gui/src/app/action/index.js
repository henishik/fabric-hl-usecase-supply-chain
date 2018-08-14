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

export const FETCH_ALL_SHIPMENT_LIST_ON_CARRIER = 'FETCH_ALL_SHIPMENT_LIST_ON_CARRIER';
export const fetchAllShipmentListOnCarrier = () => dispatch => {
  fetch('http://localhost:9998/api/shipment/list/carrier')
  .then(response => response.json())
  .then(json => dispatch({
    type: FETCH_ALL_SHIPMENT_LIST_ON_CARRIER,
    data: json
  }));
};