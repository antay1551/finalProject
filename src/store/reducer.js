import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import {ACTION_TYPES} from './constants';
export const store  = createStore(promiseReducer, applyMiddleware(thunk));

store.subscribe(()=>console.log(store.getState()));

function promiseReducer(state, action){
    if (!state)
        return {};
    if (action.type === ACTION_TYPES.COORDINATES){
        return {...state, [action.name]: {payload: action.payload}}
    }
    if (action.type === ACTION_TYPES.PROMISE){
        return {...state, 
                    [action.name]: {status: action.status, 
                                    payload: action.payload, 
                                    error: action.error}}
    }
    return state;
  }


  export default promiseReducer;