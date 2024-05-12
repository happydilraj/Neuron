import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Boats from './Boats';
import Ports from './Ports';
import SearchBoat from './SearchBoat';
import './MapComponent.css'

const MapComponent = ({boatsData, portsData, boatsAllData}) => {

  const [map, setMap] = useState(null);
  const [showShips, setShowShips] = useState(false)
  const [showPorts, setShowPorts] = useState(false)

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXNwYWNlc2VydmljZSIsImEiOiJjbHZ1dHZjdTQwMDhrMm1uMnoxdWRibzQ4In0.NaprcMBbdX07f4eXXdr-lw';

    var mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-122.411, 37.785],
      zoom: 10,
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  return (
    <>
      <Boats map={map} showShips={showShips} boatsData={boatsData}  boatsAllData={boatsAllData}/>
      <Ports map={map} showPorts={showPorts} portsData={portsData} boatsAllData={boatsAllData}/>
      <SearchBoat map={map} showShips={showShips} setShowShips={setShowShips} showPorts={showPorts} setShowPorts={setShowPorts} boatsData={boatsData}  boatsAllData={boatsAllData}/>
      
      <div id='map' style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}></div>
    </>
  );
}

export default MapComponent;
