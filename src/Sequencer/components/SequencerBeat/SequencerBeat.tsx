import clsx from "clsx";
import useSequencerStore from "../../stores/useSequencerStore";
import SequencerStep from "../SequencerStep";
import "./SequencerBeat.scss";

interface SequencerBeatProps {
  trackNo: number;
  beatNo: number;
}

function SequencerBeat({ trackNo, beatNo }: SequencerBeatProps) {
  const stepsPerBeat = useSequencerStore((s) => s.stepsPerBeat);
  const beatsPerBar = useSequencerStore((s) => s.beatsPerBar);
  const barsPerSequence = useSequencerStore((s) => s.barsPerSequence);
  const tracksLength = useSequencerStore((s) => s.tracks.length);
  const beatsLength = beatsPerBar * barsPerSequence;

  const firstTrack = trackNo === 0;
  const lastTrack = trackNo === tracksLength - 1;
  const firstBeat = beatNo === 0;
  const lastBeat = beatNo === beatsLength - 1;
  const roundNW = firstTrack && firstBeat;
  const roundNE = firstTrack && lastBeat;
  const roundSW = lastTrack && firstBeat;
  const roundSE = lastTrack && lastBeat;

  const isEven = beatNo % 2 === 0;

  return (
    <div
      className={clsx("sequencer-beat", {
        "sequencer-beat--odd": !isEven,
        "sequencer-beat--even": isEven,
        "sequencer-beat--round-nw": roundNW,
        "sequencer-beat--round-ne": roundNE,
        "sequencer-beat--round-se": roundSE,
        "sequencer-beat--round-sw": roundSW,
      })}
      style={{
        gridTemplateColumns: `repeat(${stepsPerBeat}, 1fr)`,
      }}
    >
      {Array.from({ length: stepsPerBeat }).map((_, i) => (
        <SequencerStep stepNo={beatNo * stepsPerBeat + i} trackNo={trackNo} />
      ))}
    </div>
  );
}

export default SequencerBeat;
