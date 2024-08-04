/* eslint-disable no-restricted-globals */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { access_key, API_LINK } from "constant";

export const weatherApi = createApi({
  reducerPath: "weatherApis",

  baseQuery: fetchBaseQuery({
    baseUrl: API_LINK,
  }),
  endpoints: (builder) => ({
    getWeatherFromLocale: builder.query({
      query: (q) => ({
        url: `/weather?q=${q}&APPID=${access_key}&units=metric`,
        method: "GET",
      }),
    }),
    getForecastFromLocale: builder.query({
      query: (q) => ({
        url: `/forecast?q=${q}&APPID=${access_key}&units=metric`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetWeatherFromLocaleQuery,
  useLazyGetForecastFromLocaleQuery,
  useLazyGetWeatherFromLocaleQuery,
  useGetForecastFromLocaleQuery
} = weatherApi;
