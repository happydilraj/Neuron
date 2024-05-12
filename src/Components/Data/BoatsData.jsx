import React, {useEffect, useState} from 'react'

const BoatsData = ({boatsData,setBoatsData, setBoatsAllData}) => {

    useEffect(()=>{
        getBoats();
    },[])

    const getBoats = async () => {
        const limit = 50000;
        let offset = 0;
        let allData = [];
        const latestLocations = [];
        try {
            while(true){
                const url = `https://sheet.best/api/sheets/e1b4f995-71e6-4e90-9b38-67836fd15419?_limit=${limit}&_offset=${offset}`;
                const res = await fetch(url);
                const data = await res.json();

                if (data.length === 0) {
                    break;
                }
                allData = [...allData, ...data];
                offset += limit;
            }
            // console.log(allData)
            setBoatsAllData(allData);

            allData.forEach((entry) => {
                const { site_name, location_latitude, location_longitude, ec_timestamp, heading } = entry;
                const timestamp = new Date(ec_timestamp);

                if (!(site_name in latestLocations) || timestamp > latestLocations[site_name].timestamp) {
                    latestLocations[site_name] = {
                        latitude: parseFloat(location_latitude),
                        longitude: parseFloat(location_longitude),
                        timestamp: timestamp,
                        heading: parseFloat(heading)
                    };
                }
            });
            // console.log(latestLocations)
            const features = Object.keys(latestLocations).map((site_name) => {
              return {
                  type: 'Feature',
                  geometry: {
                      type: 'Point',
                      coordinates: [latestLocations[site_name].longitude, latestLocations[site_name].latitude]
                  },
                  properties: {
                      site_name: site_name
                  }
              };
          });
  
          const data2 = {
              type: 'FeatureCollection',
              features: features
          };

          setBoatsData(data2)

        } catch (error) {
            console.log(error)
        }
    }


  return null;
}

export default BoatsData