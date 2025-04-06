import "./ArrangerTrack.scss";
import Separator from "../ArrangerGrid/Separator";

interface ArrangerTrackProps {
  width: number;
}

function ArrangerTrack({ width }: ArrangerTrackProps) {
  const separatorWidth = 100;
  const numberOfSeparators = Math.ceil(width / separatorWidth);
  // {
  //   Array.from({ length: numberOfSeparators }).map((_, i) => (
  //     <Separator offsetX={i * separatorWidth} key={i} />
  //   ));
  // }
  return <div className="arranger-track"></div>;
}

export default ArrangerTrack;
