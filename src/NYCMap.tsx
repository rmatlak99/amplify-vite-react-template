import {APIProvider, Map} from '@vis.gl/react-google-maps';
import {useEffect, useRef} from 'react';

export default function NYCMap() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const mapStyles: google.maps.MapTypeStyle[] = [
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry',
      stylers: [{color: '#ffffff'}],
    },
    {featureType: 'poi', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', stylers: [{visibility: 'off'}]},
  ];

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    map.setTilt(67);
    map.setHeading(-17.6);
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const div = map.getDiv();
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startHeading = map.getHeading() || 0;
    let startTilt = map.getTilt() || 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startHeading = map.getHeading() || 0;
      startTilt = map.getTilt() || 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      map.setHeading(startHeading - dx * 0.5);
      let tilt = startTilt + dy * 0.3;
      tilt = Math.max(0, Math.min(67, tilt));
      map.setTilt(tilt);
    };

    const endDrag = () => {
      isDragging = false;
    };

    div.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', endDrag);
    return () => {
      div.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', endDrag);
    };
  }, []);

  return (
    <APIProvider apiKey={'AIzaSyDUCsGRdMUGdOzUfYyZk-OIvzMGLjOzBvY'}>
      <div ref={containerRef} style={{width: '100vw', height: '100vh'}}>
        <Map
          onLoad={handleLoad}
          center={{lat: 40.7128, lng: -74.006}}
          zoom={18}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapTypeId={'satellite'}
          options={{styles: mapStyles}}
        />
      </div>
    </APIProvider>
  );
}
