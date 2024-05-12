import React, { useEffect, useState } from 'react';
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";



const Panel = ({ openPanel, setOpenPanel, portFeature, boatsAllData }) => {
    const { properties, _geometry } = portFeature;
    const { coordinates } = _geometry;
    const lat = coordinates[0].toFixed(2);
    const long = coordinates[1].toFixed(2);
    const [shipsVisited, setShipsVisited] = useState([]);

    const findShipsVisitedFixedPoint = (data, lat, long) => {
        if (data) {
            const shipsVisitedFixedPoint = data.filter(ship => {
                const ship_lat = parseFloat(ship.location_latitude).toFixed(2);
                const ship_long = parseFloat(ship.location_longitude).toFixed(2);
                if(ship_lat == lat && ship_long == long){
                    return true;
                }
                return false;
            });

            let index = 1;
            const shipsVisited = shipsVisitedFixedPoint.map((ship) => ({
                site_name: ship.site_name,
                index: index++
            }));
            
            setShipsVisited(shipsVisited);
            return shipsVisitedFixedPoint;
        }
        return [];
    };
    
    

    useEffect(() => {
        if (openPanel) {
            findShipsVisitedFixedPoint(boatsAllData, lat, long);
        }
    }, [openPanel, boatsAllData, lat, long]);

    return (
        <div>
            <SlidingPane
                isOpen={openPanel}
                title={properties.port_name}
                width="400px"
                onRequestClose={() => setOpenPanel(false)}
            >
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <div style={{backgroundColor: 'blue', padding: '10px', borderRadius: '23px', color: 'white', marginBottom: '100px'}}>
                        <h2>{properties.port_name}</h2>
                        <h5>Latitude : {_geometry.coordinates[0]}</h5>
                        <h5>Longitude : {_geometry.coordinates[1]}</h5>
                    </div>
                
                {
                    shipsVisited.length === 0 ? (
                        <h4 style={{backgroundColor: "red", padding: '10px', borderRadius: "23px", color: 'white'}}>No ships visited the port</h4>
                    ) : (
                        <>
                            {shipsVisited.map((ship, index) => (
                                <h4 key={index} style={{backgroundColor: "red", padding: '10px', borderRadius: "23px", color: 'white', margin: "10px 0"}}>{ship.name}</h4>
                            ))}
                        </>
                    )
                }
                </div>
            </SlidingPane>
        </div>
    );
}

export default Panel;
