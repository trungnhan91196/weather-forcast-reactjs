import { combineReducers } from '@reduxjs/toolkit';
import { weatherApi } from './weather/weatherApi';
import weatherReducer from './weather/weatherSlice';
const rootReducer = combineReducers({
  weather: weatherReducer,
  [weatherApi.reducerPath]: weatherApi.reducer,
});

export default rootReducer;