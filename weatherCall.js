let API_key = 'dc33e06201ea8009233ee56af73f4f57';

let geocodingapi=(city_name,API_key)=>(`https://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=5&appid=${API_key}`)

let weatherAPI=(lat,lon,API_key)=>(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${API_key}`)


function getLocation(city_name, API_key) {
  return new Promise((resolve, reject) => {
    fetch(geocodingapi(city_name, API_key))
      .then((data) => data.json())
      .then((data) => {
        resolve({ lon: data[0].lon, lat: data[0].lat });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getWeather(data) {
  const { API_key, lat, lon } = data;
  return new Promise((resolve, reject) => {
    fetch(weatherAPI(lat, lon, API_key))
      .then((data) => data.json())
      .then((data) => {
        resolve(data.list[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

document.getElementById('getWeatherBtn').addEventListener('click', () => {
  const city_name = document.getElementById('cityInput').value.trim();
  if (!city_name) return;

  getLocation(city_name, API_key)
    .then((data) => ({
      API_key: API_key,
      lat: data.lat,
      lon: data.lon,
    }))
    .then(getWeather)
    .then((data) => {
      document.getElementById('weatherCard').style.display = 'block';
      document.getElementById('cityName').textContent = city_name;
      document.getElementById('temp').textContent = (data.main.temp - 273.15).toFixed(2);
      document.getElementById('weather').textContent = data.weather[0].main;
      document.getElementById('humidity').textContent = data.main.humidity;
      document.getElementById('wind').textContent = data.wind.speed;
    })
    .catch((err) => {
      alert("City not found or API error!");
      console.error(err);
    });
});
