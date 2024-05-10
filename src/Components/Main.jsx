import React from 'react'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = ReactMapboxGl({
    accessToken:
      'pk.eyJ1IjoiaGFwcHlkaWxyYWoiLCJhIjoiY2w0bGJrZWw0MHJoejNpbnhhb2FwZDF2MyJ9.zJucH5aP_S4b-pk8Z6_exA'
  });

const Main = () => {
  return (
    <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
            height: '100vh',
            width: '100vw'
        }}
        >
        <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
            <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
        </Layer>
    </Map>
  )
}

export default Main