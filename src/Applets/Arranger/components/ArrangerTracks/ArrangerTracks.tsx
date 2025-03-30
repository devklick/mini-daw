import React, { useEffect, useState } from "react";
import "./ArrangerTracks.scss";
import ArrangerTrack from "../ArrangerTrack";

interface ArrangerTracksProps {
  ref: React.RefObject<HTMLDivElement | null>;
}

function ArrangerTracks({ ref }: ArrangerTracksProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  useEffect(() => {
    setTrackWidth(ref.current?.scrollWidth ?? 0);
  }, [ref, ref.current?.scrollWidth]);
  return (
    <div
      className="arranger-tracks"
      style={{ width: "100%", height: "100%" }}
      ref={ref}
    >
      <ArrangerTrack width={trackWidth} />
      <ArrangerTrack width={trackWidth} />
      <ArrangerTrack width={trackWidth} />
    </div>
  );
}

export default ArrangerTracks;
