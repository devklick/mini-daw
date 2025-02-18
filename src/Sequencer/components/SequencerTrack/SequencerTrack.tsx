import clsx from "clsx";
import useSequencerStore from "../../stores/useSequencerStore";
import "./SequencerTrack.scss";
import { getChunks } from "../../../utils/arrayUtils";

interface SequencerTrackProps {
  trackNo: number;
}

function SequencerTrack({ trackNo }: SequencerTrackProps) {
  const track = useSequencerStore((s) => s.tracks[trackNo]);
  const steps = useSequencerStore((s) => s.tracks[trackNo].steps);
  const toggleTrackStep = useSequencerStore((s) => s.toggleTrackStep);
  const stepsPerBeat = useSequencerStore((s) => s.stepsPerBeat);
  const beatsPerBar = useSequencerStore((s) => s.beatsPerBar);
  const barsPerSequence = useSequencerStore((s) => s.barsPerSequence);

  return (
    <div className="sequencer-track">
      <div className="track-info">
        <span>{track.name}</span>
      </div>
      <div
        className="track-steps"
        style={{
          gridTemplateColumns: `repeat(${beatsPerBar * barsPerSequence}, 1fr)`,
        }}
      >
        {getChunks(
          Array.from(
            { length: stepsPerBeat * beatsPerBar * barsPerSequence },
            (_, i) => steps[i]
          ),
          stepsPerBeat
        ).map((stepsInBeat, groupNo) => (
          <div
            style={{ gridTemplateColumns: `repeat(${stepsPerBeat}, 1fr)` }}
            className={clsx("track-step-group")}
            key={groupNo}
          >
            {stepsInBeat.map((step, groupStepNo) => {
              const stepNo = groupNo * stepsPerBeat + groupStepNo;
              return (
                <div className="track-step" key={`${track.id}-${stepNo}`}>
                  <button
                    onClick={() => toggleTrackStep(trackNo, stepNo)}
                    className={clsx("track-step-toggle", {
                      ["track-step-toggle--active"]: step,
                      ["track-step-toggle--inactive"]: !step,
                    })}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
export default SequencerTrack;
