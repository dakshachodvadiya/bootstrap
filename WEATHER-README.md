# Weather Dashboard

🌤️ A comprehensive real-time weather dashboard that fetches data from OpenWeatherMap API with current conditions, 5-day forecast, and hourly updates.

## Features

✨ **Real-time Weather Data**
- Current weather conditions for any city worldwide
- Temperature, humidity, wind speed, pressure, visibility
- Weather description and icons
- Sunrise and sunset times

📊 **5-Day Forecast**
- Daily weather predictions
- Max/Min temperatures
- Weather conditions with icons
- Humidity and wind speed

⏰ **24-Hour Hourly Forecast**
- Hour-by-hour weather updates
- Temperature and weather conditions
- Visual weather icons

📍 **Location Features**
- Search by city name
- Automatic location detection (geolocation)
- City and country display

🎨 **Beautiful UI**
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Brand color scheme (#518b9c, #bdf3f3, #6ababb, #377b7c)
- Loading states and error handling

## Files

- `weather-dashboard.html` - Main HTML structure
- `weather-styles.css` - Complete styling with animations
- `weather-script.js` - JavaScript with API integration

## How to Use

### 1. Search by City
- Enter any city name in the search box
- Click "Search" or press Enter
- Weather data will load automatically

### 2. Use Your Current Location
- Click the "📍 My Location" button
- Allow browser to access your location
- Dashboard will show weather for your location

### 3. View Weather Data
- **Current Weather**: Main temperature, description, detailed metrics
- **5-Day Forecast**: Swipe or scroll to see predictions
- **Hourly Forecast**: Hour-by-hour weather updates

## API

This dashboard uses the **OpenWeatherMap API** (free tier):

- **Current Weather Endpoint**: `weather?lat=,lon=`
- **Forecast Endpoint**: `forecast?lat=,lon=`
- **Geocoding Endpoint**: `geo/1.0/direct?q=`

### Getting Your Own API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your free API key from the dashboard
4. Replace the API_KEY in `weather-script.js`:

```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
```

## Features Details

### Temperature Display
- Shows current temperature in Celsius
- Feels-like temperature
- Min/Max daily temperatures

### Weather Metrics
- **Humidity**: Water vapor percentage
- **Wind Speed**: Converted to km/h
- **Pressure**: Atmospheric pressure in mb
- **Visibility**: How far you can see (in km)
- **Cloudiness**: Cloud coverage percentage

### Forecast Information
- 5-day predictions updated every 12 hours
- Each day shows max/min temperature
- Weather condition and icon
- Humidity and wind speed

### Hourly Updates
- Next 24 hours of weather
- 3-hour intervals (8 updates total)
- Temperature and conditions
- Weather icons for quick reference

## Responsive Design

**Desktop**
- Full weather details grid
- Side-by-side layout
- All information visible

**Tablet**
- Adjusted spacing
- 2-column detail grid
- Scrollable forecast

**Mobile**
- Full-width layout
- Single column details
- Horizontal scroll forecast
- Touch-friendly buttons

## Color Scheme

```
Primary: #518b9c (Teal)
Light Accent: #bdf3f3 (Cyan)
Secondary: #6ababb (Green)
Dark: #377b7c (Dark Teal)
```

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support (with geolocation)

## Troubleshooting

### "City not found"
- Check spelling of city name
- Try a larger city
- Use city name without country

### Geolocation not working
- Check browser permissions
- Some browsers require HTTPS for geolocation
- Try manual city search instead

### No data loading
- Check internet connection
- Verify API key is valid
- Check browser console for errors
- API might be rate limited (free tier limit: 60 calls/minute)

## Future Enhancements

- [ ] Add more weather metrics (UV index, air quality)
- [ ] Alerts for extreme weather
- [ ] Saved favorite cities
- [ ] Weather history/statistics
- [ ] Multiple language support
- [ ] Dark/Light theme toggle
- [ ] Weather map integration
- [ ] Air pollution data

## Deployment

### GitHub Pages
1. Push files to your repo
2. Go to Settings → Pages
3. Select main branch
4. Your dashboard will be live at: `https://yourusername.github.io/bootstrap/weather-dashboard.html`

### Alternative Hosting
- Netlify
- Vercel
- Any static hosting service

## API Credits

Weather data provided by **OpenWeatherMap**
- Free tier: 1000 calls/day
- Weather icons and data accuracy: Excellent

## License

Created as a weather dashboard project. Free to use and modify.

---

**Try it out!** Search for your city or use geolocation to see real-time weather data. 🌍☁️🌤️