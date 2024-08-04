import { RootState } from "./store";

export const getWeatherHistory = (state: RootState) => state.weather;