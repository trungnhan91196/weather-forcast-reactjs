import { EnvironmentOutlined, SearchOutlined, HistoryOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Typography, Row, Col } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getWeatherHistory } from 'state/selector';
import { useLazyGetWeatherFromLocaleQuery, useLazyGetForecastFromLocaleQuery } from 'state/weather/weatherApi';
import { IForeCast5Days, IWeatherForecast } from 'type';
import '../styles.scss';
import { deleteHistory, searchHistory } from 'state/weather/weatherSlice';

const SearchHistory: React.FC = () => {
  const navigate = useNavigate();
  const getHistoryWeather = useSelector(getWeatherHistory);
  const [currentLocale, setCurrentLocale] = React.useState<string>('vietnam');
  const [triggerWeather] = useLazyGetWeatherFromLocaleQuery();
  const [triggerForecast] = useLazyGetForecastFromLocaleQuery();
  const [dataHistory, setDataHistory] = React.useState<string[]>();
  const [data, setData] = React.useState();
  const [dataForecast, setDataForecast] = React.useState<IForeCast5Days>();
  const [showMessageError, setShowMessageError] = React.useState('');
  const dispatch = useDispatch();
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

  const handleChangeLocale = (e) => {
    setShowMessageError('');
    const location = e.target.value.split(',');
    const city_name = location[0];
    const state_code = location[1] ?? '';
    const country_code = location[2] ?? '';
    const fullLocation = `${city_name}${state_code ? `, ${state_code}` : ''}${country_code ? `, ${country_code}` : ''}`;
    setCurrentLocale(fullLocation);
  }

  const handleClickSearch = async () => {
    if (currentLocale.length) {
      const weather = await triggerWeather(currentLocale);
      if (weather?.data) {
        dispatch(searchHistory(currentLocale));
        navigate(`../${currentLocale}`);
      } else {
        setShowMessageError('Invalid country or city.');
      }
    } else {
      setShowMessageError('Please enter a valid locale');
    }
  };

  const handleClickDelete = (item) => {
    dispatch(deleteHistory(item));
  };

  useEffect(() => {
    setDataHistory(getHistoryWeather);
  }, [getHistoryWeather]);

  const handleResearch = (locale) => {
    navigate(`../${locale}`);
  };

  return (
    <div className='homepage-wrapper history-search'>
      <div className='current-locale-wrap'>
        <div className='container flex-col'>
          <div className='container'>
            <Input bordered={false}
              className='locale'
              onChange={handleChangeLocale}
              value={currentLocale}
              prefix={<EnvironmentOutlined />}
              suffix={<>
                <SearchOutlined title='click to search' onClick={handleClickSearch} />
              </>}
            />
            <HistoryOutlined title='recents search history' onClick={() => navigate('/search-history')} />
          </div>
          {showMessageError && <div className='text-danger' style={{ color: "red", fontSize: "12px" }}>{showMessageError}</div>}
        </div>
      </div>
      <div className='container-detail'>
        <Typography className='day-title'>
          Search History
        </Typography>
        <div className='search-history-wrapper card'>
          <div className='history'>
            {dataHistory?.map((item, index) => {
              return (
                <Row className='row weather-by-hours' gutter={[0,8]} key={index}>
                  <Col className='hours-col' span={20}>{item}</Col>
                  <Col className="icon search-icon" span={2}>
                    <SearchOutlined onClick={() => handleResearch(item)} />
                  </Col>
                  <Col className="icon delete-icon" span={2}>
                    <DeleteOutlined onClick={() => handleClickDelete(item)} />
                  </Col>
                </Row>
              )
            })}

          </div>
        </div>
      </div>
    </div >
  );
};

export default SearchHistory;