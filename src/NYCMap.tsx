import {APIProvider, Map, InfoWindow} from '@vis.gl/react-google-maps';
import {useState} from 'react';

interface ClickInfo {
  position: google.maps.LatLng;
  placeId: string;
}

export default function NYCMap() {
  const [info, setInfo] = useState<ClickInfo | null>(null);

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const placeId = e.placeId;
    if (placeId) {
      e.stop();
    }
    setInfo({ position: e.latLng, placeId: placeId ?? '' });
  };

  return (
    <APIProvider apiKey={'AIzaSyDUCsGRdMUGdOzUfYyZk-OIvzMGLjOzBvY'}>
      <Map
        style={{ width: '100vw', height: '100vh' }}
        defaultCenter={{ lat: 40.7128, lng: -74.006 }}
        defaultZoom={18}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapTypeId="satellite"
        tilt={67}
        onClick={handleClick}
      >
        {info && (
          <InfoWindow
            position={info.position}
            onCloseClick={() => setInfo(null)}
          >
            <div>
              <b>Place ID:</b> {info.placeId || 'N/A'}
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
