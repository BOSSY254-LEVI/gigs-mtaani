import { useEffect, useState } from "react";

type GeolocationState = {
  latitude: number;
  longitude: number;
  loading: boolean;
  error?: string;
};

export function useGeolocation(defaultLat = -1.2824, defaultLng = 36.8202): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    latitude: defaultLat,
    longitude: defaultLng,
    loading: true
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ latitude: defaultLat, longitude: defaultLng, loading: false, error: "Geolocation unsupported" });
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false
        });
      },
      (error) => {
        setState({ latitude: defaultLat, longitude: defaultLng, loading: false, error: error.message });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 30000
      }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, [defaultLat, defaultLng]);

  return state;
}

