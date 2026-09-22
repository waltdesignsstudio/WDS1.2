// Real-time Location Auto-Detection and Maps Autocomplete Service

export interface LocationSuggestion {
  id: string;
  name: string; // e.g., "Indore"
  admin1?: string; // e.g., "Madhya Pradesh"
  country?: string; // e.g., "India"
  latitude: number;
  longitude: number;
  formatted: string; // e.g., "Indore, Madhya Pradesh, India"
}

// Curated major locations for instant suggestions before/while network fetches
const POPULAR_LOCATIONS: LocationSuggestion[] = [
  { id: 'indore', name: 'Indore', admin1: 'Madhya Pradesh', country: 'India', latitude: 22.7196, longitude: 75.8577, formatted: 'Indore, Madhya Pradesh, India' },
  { id: 'mumbai', name: 'Mumbai', admin1: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777, formatted: 'Mumbai, Maharashtra, India' },
  { id: 'delhi', name: 'New Delhi', admin1: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, formatted: 'New Delhi, Delhi, India' },
  { id: 'bengaluru', name: 'Bengaluru', admin1: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946, formatted: 'Bengaluru, Karnataka, India' },
  { id: 'hyderabad', name: 'Hyderabad', admin1: 'Telangana', country: 'India', latitude: 17.3850, longitude: 78.4867, formatted: 'Hyderabad, Telangana, India' },
  { id: 'pune', name: 'Pune', admin1: 'Maharashtra', country: 'India', latitude: 18.5204, longitude: 73.8567, formatted: 'Pune, Maharashtra, India' },
  { id: 'jaipur', name: 'Jaipur', admin1: 'Rajasthan', country: 'India', latitude: 26.9124, longitude: 75.7873, formatted: 'Jaipur, Rajasthan, India' },
  { id: 'ahmedabad', name: 'Ahmedabad', admin1: 'Gujarat', country: 'India', latitude: 23.0225, longitude: 72.5714, formatted: 'Ahmedabad, Gujarat, India' },
  { id: 'chennai', name: 'Chennai', admin1: 'Tamil Nadu', country: 'India', latitude: 13.0827, longitude: 80.2707, formatted: 'Chennai, Tamil Nadu, India' },
  { id: 'kolkata', name: 'Kolkata', admin1: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639, formatted: 'Kolkata, West Bengal, India' },
  { id: 'lucknow', name: 'Lucknow', admin1: 'Uttar Pradesh', country: 'India', latitude: 26.8467, longitude: 80.9462, formatted: 'Lucknow, Uttar Pradesh, India' },
  { id: 'chandigarh', name: 'Chandigarh', admin1: 'Punjab', country: 'India', latitude: 30.7333, longitude: 76.7794, formatted: 'Chandigarh, Punjab, India' },
  { id: 'bhopal', name: 'Bhopal', admin1: 'Madhya Pradesh', country: 'India', latitude: 23.2599, longitude: 77.4126, formatted: 'Bhopal, Madhya Pradesh, India' },
  { id: 'nagpur', name: 'Nagpur', admin1: 'Maharashtra', country: 'India', latitude: 21.1458, longitude: 79.0882, formatted: 'Nagpur, Maharashtra, India' },
  { id: 'patna', name: 'Patna', admin1: 'Bihar', country: 'India', latitude: 25.5941, longitude: 85.1376, formatted: 'Patna, Bihar, India' },
  { id: 'dubai', name: 'Dubai', admin1: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, formatted: 'Dubai, United Arab Emirates' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, formatted: 'Singapore, Singapore' },
  { id: 'london', name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, formatted: 'London, Greater London, United Kingdom' },
  { id: 'newyork', name: 'New York', admin1: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, formatted: 'New York, United States' },
];

/**
 * Searches places/cities matching user keyword.
 * Uses high-speed global geocoding API with local curated fallback.
 */
export async function searchLocationKeywords(keyword: string): Promise<LocationSuggestion[]> {
  const clean = keyword.trim();
  if (!clean || clean.length < 2) {
    return POPULAR_LOCATIONS.slice(0, 6);
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(clean)}&count=10&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding search failed');
    const data = await res.json();

    if (data && Array.isArray(data.results) && data.results.length > 0) {
      return data.results.map((item: any) => {
        const parts = [item.name, item.admin1, item.country].filter(Boolean);
        return {
          id: `${item.id || item.name}-${item.latitude}`,
          name: item.name,
          admin1: item.admin1,
          country: item.country,
          latitude: item.latitude,
          longitude: item.longitude,
          formatted: parts.join(', '),
        };
      });
    }
  } catch (err) {
    console.warn('Geocoding API network error, falling back to local search:', err);
  }

  // Fallback to local filtering
  const q = clean.toLowerCase();
  return POPULAR_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(q) ||
      (loc.admin1 && loc.admin1.toLowerCase().includes(q)) ||
      (loc.country && loc.country.toLowerCase().includes(q)) ||
      loc.formatted.toLowerCase().includes(q)
  );
}

/**
 * Auto-detects user's current GPS location and reverse-geocodes to city & state.
 */
export async function autoDetectCurrentLocation(): Promise<LocationSuggestion> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser or device.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          // Reverse geocode using free BigDataCloud client API or OpenStreetMap Nominatim
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );

          if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision || 'Detected City';
            const state = data.principalSubdivision || '';
            const country = data.countryName || 'India';
            const formatted = [city, state, country].filter(Boolean).join(', ');

            resolve({
              id: `detected-${lat}-${lon}`,
              name: city,
              admin1: state,
              country,
              latitude: lat,
              longitude: lon,
              formatted,
            });
            return;
          }
        } catch (e) {
          console.warn('Reverse geocode error:', e);
        }

        // Fallback if reverse geocode fails: Return coordinates as label
        resolve({
          id: `gps-${lat}-${lon}`,
          name: 'Current Location',
          latitude: lat,
          longitude: lon,
          formatted: `Current GPS (${lat.toFixed(3)}, ${lon.toFixed(3)})`,
        });
      },
      (error) => {
        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
