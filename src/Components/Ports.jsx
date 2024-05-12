import React, {useState, useEffect} from 'react'
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import Panel from './Panel';

const Ports = ({map, showPorts, portsData, boatsAllData}) => {
    
    const [portFeature, setPortFeature] = useState({})
    const [openPanel, setOpenPanel] = useState(false)

    useEffect(() => {
        if( map && showPorts){
            addDataToMap_ports(map,portsData)
        }
        else if (map){
            removePortsDataFromMap(map);
        }
      }, [showPorts]);
    

    const addDataToMap_ports = (map, data) => {
        
        map.addSource('csvData1', {
          type: 'geojson',
          data: data,
        });
      
        
        map.addLayer({
          id: 'csvDataLayer1',
          type: 'circle',
          source: 'csvData1',
          paint: {
            'circle-radius': 5,
            'circle-color': 'blue',
          },
        });
      
        
        map.on('click', 'csvDataLayer1', (e) => {
          const feature = e.features[0];
          const coordinates = feature.geometry.coordinates;
          const properties = feature.properties;
          const description = `<h3>${properties.port_name}</h3>` +
                              `<h4><b>Latitude: </b>${coordinates[1]}</h4>` +
                              `<h4><b>Longitude: </b>${coordinates[0]}</h4>`;
      
          setPortFeature(feature)
          setOpenPanel(!openPanel)
            
        });
      
        
        map.on('mouseenter', 'csvDataLayer1', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
      
        map.on('mouseleave', 'csvDataLayer1', () => {
          map.getCanvas().style.cursor = '';
        });
      
        
        const bbox = turf.bbox(data);
        map.fitBounds(bbox, { padding: 50 });
      };

      const removePortsDataFromMap = (map) => {
        if (map.getSource('csvData1')) {
          map.removeLayer('csvDataLayer1');
          map.removeSource('csvData1');
        }
      };

  return (
    <div>
      {openPanel && <Panel openPanel={openPanel} setOpenPanel={setOpenPanel} portFeature={portFeature} boatsAllData={boatsAllData}/>}
    </div>
  )
}

export default Ports