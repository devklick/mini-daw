import { useEffect, useState } from "react";
import "./ArrangerTrack.scss";

interface ArrangerTrackProps {
  width: number;
}

function ArrangerTrack({ width }: ArrangerTrackProps) {
  const separatorWidth = 100;
  const numberOfSeparators = width / separatorWidth;
  return (
    <div className="arranger-track">
      {Array.from({ length: numberOfSeparators }).map((_, i) => (
        <div className="separator" style={{ left: i * separatorWidth }} />
      ))}
    </div>
  );
}

export default ArrangerTrack;
