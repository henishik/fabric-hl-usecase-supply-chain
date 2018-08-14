import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import rootReducer from './reducers';

export default function configureStore() {
  const initialState = {
    shipperReducer: {
      shipmentList: []
    },
    shipmentListRegulator: {
      shipmentList: []
    },
    shipmentListCarrier: {
      shipmentList: []
    }
  };
  
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware,
      promiseMiddleware
    )
  );
}
