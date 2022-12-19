import React, { Component, createRef } from "react";
import { APP_ID, DEFAULT_CITY, API_LINK, CREDIT_ORG, CREDIT_LINK } from "./WeatherBoard.config";
import "./WeatherBoard.scss";

export default class WeatherBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false
    };
  }
  
  componentDidMount() {
    this.cityRef = createRef();
    this.getData();
  }

  getData() {
    fetch(
      `${API_LINK}?q=${DEFAULT_CITY}&appid=${APP_ID}`
    )
    .then((response) => {
      if (response.ok) {
        const data = response.json();

        return data;
      }

      throw Error;
    })
    .then((data) => {
      this.setData(data);
    })
    .catch((error) => {
      console.log('Error fetching data: ', error);
      this.setState({ error: true });
    })
    .finally(() => {
      this.setState({ loading: false });
    });
  }

  setData(data) {
    const {
      weather,
      name: city,
      sys: { country },
    } = data;
    const { main, description, icon } = weather[0];

    this.setState({
      location: {
        city,
        country,
      },
      weather: {
        main,
        description,
        icon,
      },
      isCityInvalid: false,
      errorMessage: null,
      successMessage: null,
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const city = this.cityRef.current.value;

    fetch(
      `${API_LINK}?q=${city}&appid=${APP_ID}`
    )
      .then((res) => res.json())
      .then((data) => {
        const { cod } = data;

        if (cod === 200) {
          const {
            weather,
            name: city,
            sys: { country },
          } = data;
          const { main, description, icon } = weather[0];

          this.setState({
            location: {
              city,
              country,
            },
            weather: {
              main,
              description,
              icon,
            },
            successMessage: "Weather has been successfully fetched.",
            errorMessage: null,
            isCityValid: true,
            isCityInvalid: false,
          });
        } else if (cod !== 200) {
          const { message } = data;

          this.setState({
            isCityValid: false,
            isCityInvalid: true,
            successMessage: null,
            errorMessage: message,
          });
        }
      });
  }

  convertCountryIDToName(countryID) {
    let countries = new Intl.DisplayNames(["en"], { type: "region" });
    const country = countries.of(countryID);
    
    return country;
  }

  renderLocation() {
    const {
      location: { city, country: countryID },
    } = this.state;
    const country = this.convertCountryIDToName(countryID);

    return (
      <div className="location-name">
        {city}, {country}
      </div>
    );
  }

  renderWeather() {
    const {
      weather: { main, description, icon },
    } = this.state;

    return (
      <>
        <div className="weather-title">{main}</div>
        <img
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          className="weather-image"
        ></img>
        <p>{description}</p>
      </>
    );
  }

  renderWeatherForm() {
    const { isCityValid, isCityInvalid, successMessage, errorMessage } =
      this.state;

    return (
      <form
        className="weather_form"
        onSubmit={(e) => this.handleSubmit(e)}
      >
        <div
          className={`
          "message show ${ isCityValid && "isSuccess"} ${ isCityInvalid && "isError"}`}
        >
          {successMessage || errorMessage || "Please input the city below."}
        </div>
        <input
          className={`weather_input ${ isCityInvalid && "isInvalid" }`}
          type="text"
          placeholder="City"
          ref={this.cityRef}
        />
        <button className="submit_button" type="submit">
          Submit
        </button>
      </form>
    );
  }

  renderCredit() {
    return (
      <div className="weather_credit">
        Data is provided by&nbsp;
        <a className="credit_link" href={CREDIT_LINK}>
          {CREDIT_ORG}
        </a>
      </div>
    );
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      return 'Loading';
    }

    return (
      <>
        <div className="weather_board_container">
          <div className="weather_board">
            <h1 className="title">Weather Board</h1>
            {this.renderWeather()}
            {this.renderLocation()}
          </div>
          {this.renderWeatherForm()}
          {this.renderCredit()}
        </div>
      </>
    );
  }
}
