import React, {useState, useEffect} from 'react'
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

const Boats = ({map, showShips, boatsData, boatsAllData}) => {

    useEffect(() => {
        if( map && showShips){
            addDataToMap_boats(map,boatsData)
        }
        else if (map){
            removeBoatsDataFromMap(map);
        }
      }, [showShips]);

    
    const addDataToMap_boats = (map, data) => {
        
        map.addSource('csvData2', {
          type: 'geojson',
          data: data,
        });
      
        
        map.addLayer({
          id: 'csvDataLayer2',
          type: 'circle',
          source: 'csvData2',
          paint: {
            'circle-radius': 5,
            'circle-color': 'red',
          },
        });
      
        
        map.on('click', 'csvDataLayer2', (e) => {
          const feature = e.features[0];
          const coordinates = feature.geometry.coordinates;
          const properties = feature.properties;
          const description = `<h3>${properties.site_name}</h3>` +
                              `<h4><b>Latitude: </b>${coordinates[1]}</h4>` +
                              `<h4><b>Longitude: </b>${coordinates[0]}</h4>`;
      
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        });
      
        
        map.on('mouseenter', 'csvDataLayer2', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
      
        map.on('mouseleave', 'csvDataLayer2', () => {
          map.getCanvas().style.cursor = '';
        });
      
        
        const bbox = turf.bbox(data);
        map.fitBounds(bbox, { padding: 50 });
      };

      const removeBoatsDataFromMap = (map) => {
        if (map.getSource('csvData2')) {
          map.removeLayer('csvDataLayer2');
          map.removeSource('csvData2');
        }
      };

  return  null;
}

export default Boats