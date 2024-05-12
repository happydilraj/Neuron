import React, { useState } from 'react'
import MapComponent from './MapComponent'
import BoatsData from './Data/BoatsData'
import ReactLoading from 'react-loading';
import PortsData from './Data/PortsData';

const Main = () => {

  
    
    const [boatsData, setBoatsData] = useState([])
    const [boatsAllData, setBoatsAllData] = useState([])
    const [portsData, setPortsData] = useState([])


  return (
    <>
      { (boatsData.length===0 || portsData.length===0) &&
      <div className="loader">
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h2>Fetching Data</h2>
        <ReactLoading type={"spokes"} color={"red"} height={'20%'} width={'20%'} />
        </div>
      </div>
      
      }
      <BoatsData boatsData={boatsData} setBoatsData={setBoatsData} setBoatsAllData={setBoatsAllData}/> 
      <PortsData portsData={portsData} setPortsData={setPortsData}/>
      <MapComponent boatsData={boatsData} portsData={portsData} boatsAllData={boatsAllData}/>
    </>
  )
}

export default Main