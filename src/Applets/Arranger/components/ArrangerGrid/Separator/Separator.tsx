import "./Separator.scss";

interface SeparatorProps {
  offsetX: number;
}

function Separator({ offsetX }: SeparatorProps) {
  return <div className="separator" style={{ left: offsetX }} />;
}

export default Separator;
