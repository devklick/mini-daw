import React from "react";
import "./ArrangerTracks.scss";

interface ArrangerTracksProps {
  ref: React.RefObject<HTMLDivElement | null>;
}

function ArrangerTracks({ ref }: ArrangerTracksProps) {
  return (
    <div
      className="arranger-tracks"
      style={{ width: 3000, height: 3000 }}
      ref={ref}
    ></div>
  );
}

export default ArrangerTracks;
