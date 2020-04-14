import {useObjectState} from '@rehmat-falcon/use-object-state';
import { useState } from 'react';

const toJson = obj => JSON.stringify(obj);
const fromJson = str => JSON.parse(str);
/**
 * 
 * @param bool useJson 
 * @param object initial 
 * @param string key 
 */
const saveToLocalStorage = (key, value, useJson) => {
  let toStore = useJson ? toJson(value) : value;
  window.localStorage.setItem(key, toStore);
};

export const useLocalStorage = (key, initial = "", override = false) => {
  const [useJson] = useState(typeof initial === "object");
  let initialState;
  if(override) {
    saveToLocalStorage(key, initial,useJson);
    initialState = {
      value : initial,
      exists : true
    };
  } 
  else {
    let item = window.localStorage.getItem(key);
    if(item !== null && useJson) {
      item = fromJson(item);
    }
    initialState = {
      value : item,
      exists : item !== null
    };
  }
  const [state, updateState] = useObjectState(initialState);
  const update = (newValue) => {
    saveToLocalStorage(key, newValue, useJson);
    updateState({
      value : newValue,
      exists : true
    });
  };
  const remove = () => {
    window.localStorage.removeItem(key);
    updateState({
      value : null,
      exists : false
    });
  };
  const [nonReactiveState] = useObjectState(initialState);
  return {
    state,
    nonReactiveState,
    key,
    update,
    remove,
  };
};
