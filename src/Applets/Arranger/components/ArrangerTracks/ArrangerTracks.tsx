import React from "react";
import "./ArrangerTracks.scss";

interface ArrangerTracksProps {
  ref: React.RefObject<HTMLDivElement | null>;
}

function ArrangerTracks({ ref }: ArrangerTracksProps) {
  return (
    <div
      className="arranger-tracks"
      style={{ width: "100%", height: "100%" }}
      ref={ref}
    ></div>
  );
}

export default ArrangerTracks;
