import "./ArrangerGridBar.scss";

interface ArrangerGridBarProps {
  barNo: number;
  width: number;
}

function ArrangerGridBar({ barNo: _, width }: ArrangerGridBarProps) {
  return <div className="arranger-grid-bar" style={{ width }}></div>;
}

export default ArrangerGridBar;
