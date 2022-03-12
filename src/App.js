import React from 'react';
import { Viewer, CzmlDataSource } from 'resium';
import czml from 'czml-writer';
import _ from 'lodash';
const fs = require('fs');

const App = () => {
  let satelliteData = [];
  // add 5 dummy satellites
  for (let index = 0; index < 5; index++) {
    const newSatellite = {
      apogee: _.random(400.0, 500.0), // km
      perigee: _.random(400.0, 500.0), // km
      inclination: _.random(0.0, 90.0), // deg
      rightAscension: _.random(0.0, 360.0), // deg
      argumentOfPeriapsis: _.random(0.0, 360.0), // deg
    };
    const newOrbit = new czml.orbit.fromParams(newSatellite);
    const newCzml = newOrbit.czml();

    const formattedName = `Satellite-${index + 1}`;

    if (index === 0) {
      newCzml[1].id = formattedName;
      newCzml[1].label.text = formattedName;
      satelliteData = [...satelliteData, ...newCzml];
    }
    newCzml[1].id = formattedName;
    newCzml[1].label.text = formattedName;
    satelliteData = [...satelliteData, newCzml[1]];
  }

  return (
    <Viewer shouldAnimate full>
      <CzmlDataSource data={satelliteData} />
    </Viewer>
  );
};
export default App;
