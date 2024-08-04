import React, { useEffect } from 'react';
import { EnvironmentOutlined, HistoryOutlined, SearchOutlined } from '@ant-design/icons';
import Typography from 'antd/es/typography/Typography';
import { Col, Input, Row } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetForecastFromLocaleQuery, useGetWeatherFromLocaleQuery, useLazyGetForecastFromLocaleQuery, useLazyGetWeatherFromLocaleQuery } from 'state/weather/weatherApi';
import { IForeCast5Days, IWeatherForecast, List } from 'type';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getWeatherHistory } from 'state/selector';
import '../styles.scss';
import IconWiDirectionDownLeft from 'assets/WindIcon';
import { searchHistory } from 'state/weather/weatherSlice';
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { locale: localeParams } = useParams();

  const [data, setData] = React.useState<IWeatherForecast>();
  const [dataForecast, setDataForecast] = React.useState<IForeCast5Days>();

  const [currentLocale, setCurrentLocale] = React.useState<string>('vietnam');
  const [showMessageError, setShowMessageError] = React.useState('');
  const { data: fetchDataWeather } = useGetWeatherFromLocaleQuery('vietnam');
  const { data: fetchDataForecast } = useGetForecastFromLocaleQuery('vietnam');
  const [triggerWeather, weatherApi,] = useLazyGetWeatherFromLocaleQuery();
  const [triggerForecast, forecastApi] = useLazyGetForecastFromLocaleQuery();
  const dispatch = useDispatch();
  const handleChangeLocale = (e) => {
    setShowMessageError('');
    const location = e.target.value.split(',');
    const city_name = location[0];
    const state_code = location[1] ?? '';
    const country_code = location[2] ?? '';
    const fullLocation = `${city_name}${state_code ? `, ${state_code}` : ''}${country_code ? `, ${country_code}` : ''}`;
    setCurrentLocale(fullLocation);
  }

  const handleClickSearch = async (isResearch?: boolean) => {
    const localeName = isResearch ? localeParams : currentLocale;
    if (localeName?.length) {
      const weather = await triggerWeather(localeName);
      const forecast = await triggerForecast(localeName);
      if (weather?.data && forecast?.data) {
        setData(weather.data);
        groupDataByDate(forecast?.data);
        dispatch(searchHistory(localeName));
      } else {
        setShowMessageError('Invalid country or city.');
      }
    } else {
      setShowMessageError('Please enter a valid locale');
    }
  }

  const groupDataByDate = (data: any) => {
    if (data) {
      const groupedData = data?.list?.reduce((current, next) => {
        const dateOfNextItem = moment(next.dt_txt).format('YYYY-MM-DD');
        if (!current[dateOfNextItem]) {
          current[dateOfNextItem] = [];
        }
        current[dateOfNextItem].push(next);
        return current;
      }, {});
      setDataForecast({
        ...data,
        list: groupedData
      });
    }
  };

  useEffect(() => {
    fetchDataForecast && groupDataByDate(fetchDataForecast);
  }, [fetchDataForecast]);

  useEffect(() => {
    fetchDataWeather && setData(fetchDataWeather);
  }, [fetchDataWeather]);

  //go from history page to homepage
  //if params have data, get weather and forecast data
  useEffect(() => {
    if (localeParams) {
      setCurrentLocale(localeParams);
      handleClickSearch(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localeParams]);

  return (
    <div className='homepage-wrapper'>
      <div className='current-locale-wrap'>
        <div className='container flex-col'>
          <div className='container'>
            <Input bordered={false}
              className='locale'
              onChange={handleChangeLocale}
              value={currentLocale}
              prefix={<EnvironmentOutlined />}
              suffix={<>
                <SearchOutlined title='click to search' onClick={() => handleClickSearch(false)} />
              </>}
            />
            <HistoryOutlined title='recents search history' onClick={() => navigate('/search-history')} />
          </div>
          {showMessageError && <div className='text-danger' style={{ color: "red", fontSize: "12px" }}>{showMessageError}</div>}
        </div>
      </div>
      <div className='container-detail'>
        <div className='details-weather card'>
          <div className='date'>{(moment(data?.dt ? Number(data?.dt) * 1000 : new Date()).format('MMMM DD, YYYY'))}</div>
          <div className='temparature-block'>
            <img src={`https://openweathermap.org/img/wn/${data?.weather ? data?.weather[0]?.icon : '02d'}@2x.png`}
              alt='weather-icon' />
            <div className='temp-wrap'>
              <div className='temp-num'>{data?.main?.temp}&deg;C</div>
              <div className='info-temp'>{data?.weather?.length && data?.weather[0]?.main}</div>
            </div>
          </div>
          <div className='more-details'>
            <div className='type-grp'>
              <span className='type'>Humidity</span>
              <strong>{data?.main?.humidity}%</strong>
            </div>
            <div className='type-grp'>
              <span className='type'>Winds</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconWiDirectionDownLeft />
                <strong>{data?.wind?.speed}m/s</strong>
              </div>
            </div>
            <div className='type-grp'>
              <span className='type'>Visibility</span>
              <strong>{Number(data?.visibility ?? 0) / 1000}km</strong>
            </div>
          </div>
        </div>
        <div className='day-wrapper'>
          <Typography className='day-title'>5-Days Forecast (3 Hours)</Typography>
          <div className='5day-card card'>
            {!!dataForecast && Object.entries(dataForecast?.list).map(([item, forecast]: [string, List[]]) => {
              return <>
                <Typography className='date forecast-by-hours'>{(moment(item ?? new Date()).format('MMMM DD'))}
                </Typography>
                {!!forecast && forecast?.map((hourlyForecast, idx) => {
                  return (
                    <>
                      <Row className='row weather-by-hours' key={idx} gutter={8}>
                        <Col className='hours-col' span={4}>
                          {moment(hourlyForecast.dt_txt ?? new Date()).format('HH:mm')}
                        </Col>
                        <Col className='temp-col' span={10}>
                          <img alt={`icon-${hourlyForecast.dt_txt}`}
                            src={`https://openweathermap.org/img/wn/${hourlyForecast.weather[0]?.icon}.png`} />
                          {hourlyForecast.main.temp_min}/{hourlyForecast.main.temp_max}°C
                        </Col>
                        <Col className='describe-col' span={10}>
                          {hourlyForecast.weather[0]?.description}
                        </Col>
                      </Row>
                    </>
                  );
                })
                }
              </>
            })}
          </div>
        </div>
      </div>

    </div >
  );
};

export default HomePage;
