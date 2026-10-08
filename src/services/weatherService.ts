import { WeatherData } from '../types';

const WEATHER_CACHE_KEY = 'farmer_friend_weather_cache';

const DEFAULT_DEMO_WEATHER: WeatherData = {
  location: 'Thanjavur, Tamil Nadu',
  temp: 31,
  condition: 'Partly Cloudy',
  conditionTa: 'பகுதி மேகமூட்டம்',
  iconName: 'cloud-sun',
  humidity: 68,
  windSpeed: 14,
  rainChance: 45,
  lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  isDemo: true,
  farmingAlert: 'Rain is possible tomorrow. Consider safely harvesting mature crops today.',
  farmingAlertTa: 'நாளை மழை வாய்ப்பு உள்ளது. அறுவடைக்கு தயாரான பயிர்களை இன்று பாதுகாப்பாக சேகரிக்கவும்.'
};

export async function fetchCurrentWeather(): Promise<WeatherData> {
  // Check online status
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const cached = getCachedWeather();
    if (cached) return cached;
    return DEFAULT_DEMO_WEATHER;
  }

  // Get geolocation coordinates if available
  let coords: { lat: number; lon: number } | null = null;
  try {
    coords = await getUserCoordinates();
  } catch {
    // Default to Thanjavur, Tamil Nadu
    coords = { lat: 10.7870, lon: 79.1378 };
  }

  const googleKey = import.meta.env.VITE_GOOGLE_WEATHER_API_KEY;
  const openWeatherKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // 1. Try Google Weather API if key provided
  if (googleKey && coords) {
    try {
      const res = await fetch(
        `https://weather.googleapis.com/v1/currentConditions:lookup?key=${googleKey}&location.latitude=${coords.lat}&location.longitude=${coords.lon}`
      );
      if (res.ok) {
        const data = await res.json();
        const weather: WeatherData = {
          location: data.location?.displayName || 'Thanjavur, Tamil Nadu',
          temp: Math.round(data.temperature?.degrees || 31),
          condition: data.condition?.description || 'Partly Cloudy',
          conditionTa: translateCondition(data.condition?.description),
          iconName: mapWeatherIcon(data.condition?.description),
          humidity: data.humidityPercentage || 68,
          windSpeed: Math.round(data.windSpeed?.speedKilometersPerHour || 14),
          rainChance: data.precipitationProbability || 45,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDemo: false,
          farmingAlert: generateAgriGuidance(data.precipitationProbability || 45, data.humidityPercentage || 68, false),
          farmingAlertTa: generateAgriGuidance(data.precipitationProbability || 45, data.humidityPercentage || 68, true)
        };
        cacheWeather(weather);
        return weather;
      }
    } catch {
      // Fall through to OpenWeather or Demo
    }
  }

  // 2. Try OpenWeatherMap API if key provided
  if (openWeatherKey && coords) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${openWeatherKey}`
      );
      if (res.ok) {
        const data = await res.json();
        const mainCondition = data.weather?.[0]?.main || 'Clear';
        const rainProb = mainCondition.toLowerCase().includes('rain') ? 70 : 25;
        const weather: WeatherData = {
          location: `${data.name || 'Thanjavur'}, Tamil Nadu`,
          temp: Math.round(data.main?.temp || 31),
          condition: data.weather?.[0]?.description || 'Partly Cloudy',
          conditionTa: translateCondition(data.weather?.[0]?.description),
          iconName: mapWeatherIcon(data.weather?.[0]?.main),
          humidity: data.main?.humidity || 68,
          windSpeed: Math.round((data.wind?.speed || 4) * 3.6),
          rainChance: rainProb,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDemo: false,
          farmingAlert: generateAgriGuidance(rainProb, data.main?.humidity || 68, false),
          farmingAlertTa: generateAgriGuidance(rainProb, data.main?.humidity || 68, true)
        };
        cacheWeather(weather);
        return weather;
      }
    } catch {
      // Fall through to Demo
    }
  }

  // 3. Fallback to cached or Demo Weather
  const cached = getCachedWeather();
  if (cached) {
    return {
      ...cached,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDemo: true
    };
  }

  return {
    ...DEFAULT_DEMO_WEATHER,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

function getUserCoordinates(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
      },
      (err) => reject(err),
      { timeout: 6000 }
    );
  });
}

function cacheWeather(data: WeatherData) {
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export function getCachedWeather(): WeatherData | null {
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore
  }
  return null;
}

function translateCondition(conditionStr?: string): string {
  if (!conditionStr) return 'பகுதி மேகமூட்டம்';
  const c = conditionStr.toLowerCase();
  if (c.includes('rain')) return 'மழைப்பொழிவு';
  if (c.includes('cloud')) return 'மேகமூட்டம்';
  if (c.includes('clear') || c.includes('sun')) return 'தெளிவான வானிலை';
  if (c.includes('thunder')) return 'இடிமின்னலுடன் கூடிய மழை';
  if (c.includes('haze') || c.includes('mist')) return 'பனிமூட்டம்';
  return 'பகுதி மேகமூட்டம்';
}

function mapWeatherIcon(condition?: string): string {
  if (!condition) return 'cloud-sun';
  const c = condition.toLowerCase();
  if (c.includes('rain')) return 'cloud-rain';
  if (c.includes('thunder')) return 'cloud-lightning';
  if (c.includes('clear') || c.includes('sun')) return 'sun';
  if (c.includes('cloud')) return 'cloud-sun';
  return 'cloud';
}

function generateAgriGuidance(rainChance: number, humidity: number, inTamil: boolean): string {
  if (rainChance > 40) {
    return inTamil
      ? 'நாளை மழை வாய்ப்பு உள்ளது. அறுவடைக்கு தயாரான பயிர்களை இன்று பாதுகாப்பாக சேகரிக்கவும்.'
      : 'Rain is possible tomorrow. Consider safely harvesting mature crops today.';
  }
  if (humidity > 75) {
    return inTamil
      ? 'அதிக காற்றில் ஈரப்பதம் உள்ளது. தக்காளி மற்றும் காய்கறி பயிர்களில் பூஞ்சை தொற்று உருவாகாமல் கவனிக்கவும்.'
      : 'High humidity detected. Watch out for early fungal risks on tomato and vegetable leaves.';
  }
  return inTamil
    ? 'சாதகமான வானிலை நிலவுகிறது. வழக்கமான உரம் மற்றும் பாசன பணிகளை மேற்கொள்ளலாம்.'
    : 'Favorable field conditions. Suitable for standard irrigation and fertilizer application.';
}
