import React, {useEffect, useState} from 'react'
import ReactSearchBox from "react-search-box";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

const SearchBoat = ({map, boatsData, boatsAllData, showShips, setShowShips, showPorts, setShowPorts}) => {

    const [value, setValue] = useState("");
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [allAvailableShips,setAllAvailableShips] = useState([])

    const drawShipRoute1 = (shipDataLastTwoDays, shipName) => {
        
        if (map.getSource('route1')) {
          map.removeLayer('route1');
          map.removeSource('route1');
        }
      
        map.addSource('route1', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': shipDataLastTwoDays
            }
          }
        });
      
        map.addLayer({
          'id': 'route1',
          'type': 'line',
          'source': 'route1',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': 'red',
            'line-width': 8
          }
        });
      };
      
      const drawShipRoute2 = (shipDataTwoAndSevenDays, shipName) => {
    
        if (map.getSource('route2')) {
          map.removeLayer('route2');
          map.removeSource('route2');
        }
      
        map.addSource('route2', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': shipDataTwoAndSevenDays
            }
          }
        });
      
        map.addLayer({
          'id': 'route2',
          'type': 'line',
          'source': 'route2',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': 'blue',
            'line-width': 8,
            'line-dasharray': [2, 2] 
          }
        });
      };

    const extractShipDataLastTwoDays = (data, siteName) => {
        const filteredData = data.filter(ship => ship.site_name === siteName);
        const sortedData = filteredData.sort((a, b) => new Date(b.ec_timestamp) - new Date(a.ec_timestamp));
        
        const latestDate = new Date(sortedData[0].ec_timestamp);
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(latestDate.getDate() - 2);
        
        const lastTwoDaysData = sortedData.filter(ship => new Date(ship.ec_timestamp) >= twoDaysAgo);
        
        const shipLocations = lastTwoDaysData.map(ship => [
            parseFloat(ship.location_longitude),
            parseFloat(ship.location_latitude)
        ]);
        
        return shipLocations;
    };
    
    const extractShipDataBetweenTwoAndSevenDays = (data, siteName) => {
      const filteredData = data.filter(ship => ship.site_name === siteName);
      const sortedData = filteredData.sort((a, b) => new Date(b.ec_timestamp) - new Date(a.ec_timestamp));
      
      const latestDate = new Date(sortedData[0].ec_timestamp);
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(latestDate.getDate() - 2);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(latestDate.getDate() - 7);
      
      const dataBetweenTwoAndSevenDays = sortedData.filter(ship => {
          const shipDate = new Date(ship.ec_timestamp);
          return shipDate >= sevenDaysAgo && shipDate < twoDaysAgo;
      });
      
      const shipLocations = dataBetweenTwoAndSevenDays.map(ship => [
          parseFloat(ship.location_longitude),
          parseFloat(ship.location_latitude)
      ]);
      
      return shipLocations;
    };

    const searchShip = (shipName) => {
        const features = boatsData.features;
        const ship = features.find((feature) => feature.properties.site_name.toLowerCase() === shipName.toLowerCase());
        
        if (ship) {
            const coordinates = ship.geometry.coordinates;
            map.flyTo({
                center: coordinates,
                zoom: 12,
            });
            const shipDataLastTwoDays = extractShipDataLastTwoDays(boatsAllData, shipName);
            const shipDataTwoAndSevenDays = extractShipDataBetweenTwoAndSevenDays(boatsAllData, shipName);
      
            drawShipRoute1(shipDataLastTwoDays,shipName);
            drawShipRoute2(shipDataTwoAndSevenDays, shipName);

        } else {
            alert(`Ship '${shipName}' not found`);
        }
    };

    useEffect(() => {
        FetchAllAvailableShips()
    })

    const FetchAllAvailableShips = () => {
        const names = []
        if (boatsData && boatsData.features) {
            boatsData.features.forEach((boat) => {
                const name = boat.properties.site_name;
                names.push(name);
            });
        }
        setAllAvailableShips(names)
    };
    
    const handleSearchChange = (value) => {
    setValue(value);
    };

    const handleSearch = () => {
    searchShip(value);
    };
      

  return (
    <div>
        <div className="search-container">
            <div className="form-check form-switch">
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"> Show ships </label>
            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={() => setShowShips(!showShips)}/>
            </div>
            <div className="form-check form-switch">
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"> Show Ports </label>
            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={() => setShowPorts(!showPorts)}/>
        </div>
        <div>
            <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}> Available Ships </button>
        </div>
            <ReactSearchBox
            placeholder="Search ship..."
            value={value}
            onChange={handleSearchChange}
            onSelect={handleSearch}
            inputBackgroundColor='red'
            inputBorderColor='pink'
            
            />
            <button onClick={handleSearch}>Search</button>
      </div>
      <div>
       <SlidingPane
            isOpen={isSidePanelOpen}
            title={"All Available Ships"}
            width="400px"
            onRequestClose={() => setIsSidePanelOpen(false)}
        >
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <div style={{padding: '10px', borderRadius: '23px', color: 'white', marginBottom: '100px'}}>
                    {
                        allAvailableShips.map((name) => (
                            <h3 style={{color: 'red', backgroundColor: '#75cff0', padding: '15px', borderRadius: '23px'}} key={name}>{name}</h3>
                        ))
                    }
                </div>
            </div>
        </SlidingPane>
      </div>
    </div>
  )
}

export default SearchBoat