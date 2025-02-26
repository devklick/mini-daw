import clsx from "clsx";
import "./Num.scss";

interface NumProps {
  value: number;
  onChange(value: number): void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

function Num({ onChange, value, max, min, label, className }: NumProps) {
  return (
    <div className={clsx("number")}>
      {label && <label className="number__label">{label}</label>}
      <input
        className={clsx("number__input", className)}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
      />
    </div>
  );
}

export default Num;
