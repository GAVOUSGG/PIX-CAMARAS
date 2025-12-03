import React from "react";
import TournamentChart from "./TournamentChart";
import ShipmentsChart from "./ShipmentsChart";

const ChartsGrid = ({ tournaments, shipments }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <TournamentChart tournaments={tournaments} />
      <ShipmentsChart shipments={shipments} />
    </div>
  );
};

export default ChartsGrid;
