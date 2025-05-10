import React from "react";
import { useEffect, useRef } from "react";
import "./Weather.css";
import { useState } from "react";
import cloudy_day from "../assets/animated/cloudy-day-2.svg";
import cloudy_night from "../assets/animated/cloudy-night-2.svg";
import cloudy from "../assets/animated/cloudy.svg";
import day from "../assets/animated/day.svg";
import night from "../assets/animated/night.svg";
import rain from "../assets/animated/rainy-6.svg";
import drizzle from "../assets/animated/rainy-2.svg";
import snowy from "../assets/animated/snowy-5.svg";
import thunder from "../assets/animated/thunder.svg";
import humidity from "../assets/animated/humidity.gif";
import wind from "../assets/animated/wind_pressure.gif";

const Weather = () => {
  const inputRef = useRef(null);
  const [weatherData, setWeatherData] = useState(false);

  const allIcons = {
    "01d": day,
    "01n": night,
    "02d": cloudy_day,
    "02n": cloudy_night,
    "03d": cloudy,
    "03n": cloudy,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "11d": thunder,
    "13d": snowy,
    "13n": snowy,
  };

  const search = async (city) => {
    if (city === "") {
      alert("Please enter a city name");
      return;
    }
    try {
      const apiKey = import.meta.env.VITE_APP_ID;

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      console.log(data);
      const icon = allIcons[data.weather[0].icon || "01d"];
      setWeatherData({
        humidity: data.main.humidity,
        wind: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
        description: data.weather[0].description,
      });
      inputRef.current.value = "";
    } catch (error) {
      setWeatherData(false);
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    search("Cuttack");
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search for a city..." />
        <button
          className="search-button"
          onClick={() => search(inputRef.current.value)}
        >
          Search
        </button>
      </div>
      {weatherData ? (
        <>
          <img src={weatherData.icon} className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="description">{weatherData.description}</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-info">
            <div className="col">
              <img src={humidity} className="humidity-icon" alt="humidity" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind} className="wind-icon" alt="wind" />
              <div>
                <p>{weatherData.wind} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Weather;
