import clsx from "clsx";
import ControlKnob from "../../components/ControlKnob";
import useToggle from "../../hooks/stateHooks/useToggle";
import useSequencerStore, {
  SequencerTrack,
} from "../../Applets/Sequencer/stores/useSequencerStore";
import "./TrackProperty.scss";

type PropertyKeys = keyof Pick<
  SequencerTrack,
  "mute" | "name" | "pan" | "pitch" | "volume"
>;

interface TrackPropertyProps<Name extends PropertyKeys> {
  trackId: string;
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
  trackId,
  name,
  description,
  label,
  type,
  onChange,
  disabled,
  min,
  max,
}: TrackPropertyProps<Name>) {
  const value = useSequencerStore((s) => s.tracks[trackId]?.[name]);
  const [expanded, { toggle }] = useToggle();

  function handleChange(newValue: unknown) {
    onChange(newValue as Readonly<SequencerTrack>[Name]);
  }

  return (
    <div
      className={clsx("track-property", {
        ["track-property--expanded"]: expanded,
      })}
    >
      <div
        className={clsx("track-property__top", {
          ["track-property__top--expanded"]: expanded,
        })}
        onClick={toggle}
      >
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

      {expanded && <p>{description}</p>}
    </div>
  );
}
export default TrackProperty;
