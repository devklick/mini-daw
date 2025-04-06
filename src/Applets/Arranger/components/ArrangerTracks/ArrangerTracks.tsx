import React, { useEffect, useState } from "react";

import ArrangerTrack from "../ArrangerTrack";
import ArrangerGrid from "../ArrangerGrid";

import "./ArrangerTracks.scss";

interface ArrangerTracksProps {
  ref: React.RefObject<HTMLDivElement | null>;
}

function ArrangerTracks({ ref }: ArrangerTracksProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const resize = () => {
      if (!ref.current) return;
      setTrackWidth(ref.current.clientWidth);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return (
    <div className="arranger-tracks" ref={ref}>
      <ArrangerGrid />
      <ArrangerTrack width={trackWidth} key={1} />
      <ArrangerTrack width={trackWidth} key={2} />
      <ArrangerTrack width={trackWidth} key={3} />
    </div>
  );
}

export default ArrangerTracks;
