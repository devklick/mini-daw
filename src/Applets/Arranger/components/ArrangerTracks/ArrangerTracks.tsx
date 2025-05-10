import React from "react";

import ArrangerTrack from "../ArrangerTrack";
import ArrangerGrid from "../ArrangerGrid";

import "./ArrangerTracks.scss";
import { useSyncSize } from "../../../../hooks/stateHooks/useSyncSize";

interface ArrangerTracksProps {
  ref: React.RefObject<HTMLDivElement | null>;
}

function ArrangerTracks({ ref }: ArrangerTracksProps) {
  const [trackWidth] = useSyncSize({ elementRef: ref, dimensions: ["width"] });

  return (
    <div className="arranger-tracks" ref={ref}>
      <ArrangerTrack width={trackWidth} key={1} />
      <ArrangerTrack width={trackWidth} key={2} />
      <ArrangerTrack width={trackWidth} key={3} />
      <ArrangerGrid />
    </div>
  );
}

export default ArrangerTracks;
