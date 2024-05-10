import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import GeoJSON from 'geojson'
import './MapComponent.css'

const MapComponent = () => {

    useEffect(() => {

        mapboxgl.accessToken = 'pk.eyJ1IjoiaGFwcHlkaWxyYWoiLCJhIjoiY2w0bGJrZWw0MHJoejNpbnhhb2FwZDF2MyJ9.zJucH5aP_S4b-pk8Z6_exA';

        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-122.411, 37.785],
          zoom: 10,
        });
    
        map.on('load', () => {
          getPorts(map);
          getBoats(map);
        });
      }, []); 

    
        
    const getPorts = async ( map ) => {
        try {
            const res = await fetch("https://sheet.best/api/sheets/346b97f3-0b2b-4b1d-a463-a96bf463ce06");
            const data = await res.json();
            console.log(data)
            const data2 = GeoJSON.parse(data, {Point: ['geo_location_latitude', 'geo_location_longitude']});
            addDataToMap(map,data2)
        } catch (error) {
            console.log(error)
        }
    }

    const getBoats = async ( map ) => {
        try {
            const res = await fetch("https://sheet.best/api/sheets/e1b4f995-71e6-4e90-9b38-67836fd15419");
            const data = await res.json();
            const latestLocations = [];

            data.forEach((entry) => {
                const { site_name, location_latitude, location_longitude, ec_timestamp, heading } = entry;

                // Convert timestamp to Date object
                const timestamp = new Date(ec_timestamp);

                // If the ship is not in the latestLocations object or its timestamp is more recent,
                // update the latest location for that ship
                if (!(site_name in latestLocations) || timestamp > latestLocations[site_name].timestamp) {
                    latestLocations[site_name] = {
                        latitude: parseFloat(location_latitude),
                        longitude: parseFloat(location_longitude),
                        timestamp: timestamp,
                        heading: parseFloat(heading)
                    };
                }
            });
            const data2 = GeoJSON.parse(latestLocations, {Point: ['latitude', 'longitude']});
            console.log(latestLocations)

        } catch (error) {
            console.log(error)
        }
    }

    const addDataToMap = (map, data) => {
        
        map.addSource('csvData', {
          type: 'geojson',
          data: data,
        });
      
        
        map.addLayer({
          id: 'csvDataLayer',
          type: 'circle',
          source: 'csvData',
          paint: {
            'circle-radius': 5,
            'circle-color': 'purple',
          },
        });
      
        
        map.on('click', 'csvDataLayer', (e) => {
          const feature = e.features[0];
          const coordinates = feature.geometry.coordinates;
          const properties = feature.properties;
          const description = `<h3>${properties.port_name}</h3>` +
                              `<h4><b>Latitude: </b>${coordinates[1]}</h4>` +
                              `<h4><b>Longitude: </b>${coordinates[0]}</h4>`;
      
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        });
      
        
        map.on('mouseenter', 'csvDataLayer', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
      
        map.on('mouseleave', 'csvDataLayer', () => {
          map.getCanvas().style.cursor = '';
        });
      
        
        const bbox = turf.bbox(data);
        map.fitBounds(bbox, { padding: 50 });
      };
      
  
    

  return (
    <div id='map' style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}></div>
  );
}

export default MapComponent;
