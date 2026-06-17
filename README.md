# ATMOS

Atmos is a weather dashboard built using HTML, CSS, and Vanilla JavaScript.

The biggest learning from this project was working with multiple APIs and integrating them into a single application.

## Check it out live!
https://sarthak-rohilla-22.github.io/Atmos/

## Screenshots
<img width="1453" height="831" alt="image" src="https://github.com/user-attachments/assets/3f8cbb60-554c-4415-b256-50ad7a8457e4" />
<img width="1453" height="827" alt="image" src="https://github.com/user-attachments/assets/2620426b-35cf-4ec3-9d8a-45db450f67b3" />
<img width="1453" height="827" alt="image" src="https://github.com/user-attachments/assets/bf0f9edb-66a7-480c-9897-54d75b0f197c" />
<img width="1453" height="679" alt="image" src="https://github.com/user-attachments/assets/fa706c2f-9bff-4e98-9bc3-cadd30f23c61" />
<img width="1453" height="831" alt="image" src="https://github.com/user-attachments/assets/bc77d4cf-1a8d-4690-95c3-36cb0d9e9d41" />
<img width="1453" height="831" alt="image" src="https://github.com/user-attachments/assets/9fa01e45-57e5-413d-ab71-dcfcab86685e" />


## Feature List

<ul>
  <li>Automatically obtains the user's location (after permission is granted) and renders a weather card using the browser's Geolocation API.</li>
  <li>Interactive 3D globe powered by Globe.gl and Three.js.</li>
  <li>Dark mode and Light mode toggle functionality.</li>
  <li>Location autocomplete feature that suggests cities based on user input.</li>
  
  <li>Displays current weather information such as:
    <ol>
      <li>Temperature</li>
      <li>Feels Like</li>
      <li>Humidity</li>
      <li>Wind Speed</li>
      <li>Pressure</li>
    </ol>
  </li>
  <li>Limits the number of weather cards to 8. Attempting to add more displays an alert popup.</li>
  <li>Automatically saves weather cards and theme preferences using Local Storage.</li>
  <li>Detailed hourly forecast visualized through charts, including:
    <ol>
      <li>Temperature (°C)</li>
      <li>Precipitation (mm)</li>
      <li>Relative Humidity (%)</li>
      <li>Pressure (hPa)</li>
      <li>UV Index</li>
      <li>Wind Speed (km/hr)</li>
    </ol>
  </li>
  <li>Detailed 7-day forecast visualized through charts, including:
    <ol>
      <li>Maximum Temperature (°C)</li>
      <li>Minimum Temperature (°C)</li>
      <li>Precipitation (mm)</li>
      <li>Sunshine Duration (hours)</li>
      <li>UV Index</li>
      <li>Wind Speed (km/hr)</li>
    </ol>
  </li>
  <li>Interactive world weather map with live precipitation overlays.</li>
</ul>

## Libraries Used

<ul>
  <li><strong>Three.js</strong> - Used for rendering and animating the 3D globe.</li>
  <li><strong>Globe.gl</strong> - Provides the ready-made interactive globe built on top of Three.js.</li>
  <li><strong>Chart.js</strong> - Used for all forecast visualizations and weather analytics charts.</li>
  <li><strong>Leaflet.js</strong> - Used to build the interactive weather map.</li>
</ul>

## APIs Used

<ul>
  <li><strong>OpenWeatherMap</strong>
    <ol>
      <li>Location autocomplete and city search.</li>
      <li>Current weather data.</li>
      <li>Weather map tile layers.</li>
    </ol>
  </li>
  <li><strong>Open-Meteo</strong>
    <ol>
      <li>Detailed hourly weather forecasts.</li>
      <li>Detailed 7-day weather forecasts.</li>
      <li>Weather analytics data used in charts.</li>
    </ol>
  </li>
  <li><strong>Browser Features</strong>
    <ol>
      <li><strong>Local Storage API</strong> - Stores saved cities and theme preferences.</li>
      <li><strong>Geolocation API</strong> - Retrieves the user's current location.</li>
      <li><strong>Fetch API</strong> - Handles communication with external APIs.</li>
    </ol>
  </li>
</ul>
