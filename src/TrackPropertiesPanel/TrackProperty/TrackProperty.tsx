import ControlKnob from "../../components/ControlKnob";
import useSequencerStore, {
  SequencerTrack,
} from "../../Sequencer/stores/useSequencerStore";
import "./TrackProperty.scss";

type PropertyKeys = keyof Pick<
  SequencerTrack,
  "mute" | "name" | "pan" | "pitch" | "volume"
>;

interface TrackPropertyProps<Name extends PropertyKeys> {
  trackNo: number;
  name: Name;
  label: string;
  description: string;
  onChange(value: SequencerTrack[Name]): void;
  type: "text" | "knob" | "checkbox";
  disabled?: boolean;
  min?: number;
  max?: number;
}

function TrackProperty<Name extends PropertyKeys>({
  trackNo,
  name,
  description,
  label,
  type,
  onChange,
  disabled,
  min,
  max,
}: TrackPropertyProps<Name>) {
  const value = useSequencerStore((s) => s.tracks[trackNo]?.[name]);
  function handleChange(newValue: unknown) {
    onChange(newValue as Readonly<SequencerTrack>[Name]);
  }
  return (
    <div className="track-property">
      <div className="track-property__top">
        <div className="track-property__top__inner">
          <div className="track-property__top__inner-left">
            <label>{label}</label>
            <span>{value}</span>
          </div>
          <div className="track-property__top_inner-right">
            {type === "knob" && (
              <ControlKnob
                defaultValue={Number(value)}
                max={max ?? 100}
                min={min ?? 0}
                onChange={handleChange}
                size="small"
                disabled={disabled}
              />
            )}
          </div>
        </div>
      </div>

      <p>{description}</p>
    </div>
  );
}
export default TrackProperty;
