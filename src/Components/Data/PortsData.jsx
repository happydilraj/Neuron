import React, {useEffect} from 'react'
import GeoJSON from 'geojson'

const PortsData = ({portsData,setPortsData}) => {

    useEffect(()=>{
        getPorts();
    },[])

    const getPorts = async () => {
        try {
            const res = await fetch("https://sheet.best/api/sheets/346b97f3-0b2b-4b1d-a463-a96bf463ce06");
            const data = await res.json();
            const data2 = GeoJSON.parse(data, {Point: ['geo_location_latitude', 'geo_location_longitude']});
        
            setPortsData(data2)
        } catch (error) {
            console.log(error)
        }
    }

  return null;
}

export default PortsData