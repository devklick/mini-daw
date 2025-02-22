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
  const n = firstTrack;
  const e = lastBeat;
  const s = lastTrack;
  const w = firstBeat;
  const nw = firstTrack && firstBeat;
  const ne = firstTrack && lastBeat;
  const sw = lastTrack && firstBeat;
  const se = lastTrack && lastBeat;

  const isEven = beatNo % 2 === 0;

  return (
    <div
      className={clsx("sequencer-beat", {
        "sequencer-beat--odd": !isEven,
        "sequencer-beat--even": isEven,
        "sequencer-beat--n": n,
        "sequencer-beat--e": e,
        "sequencer-beat--s": s,
        "sequencer-beat--w": w,
        "sequencer-beat--nw": nw,
        "sequencer-beat--ne": ne,
        "sequencer-beat--se": se,
        "sequencer-beat--sw": sw,
      })}
      style={{
        gridTemplateColumns: `repeat(${stepsPerBeat}, 1fr)`,
      }}
    >
      {Array.from({ length: stepsPerBeat }).map((_, i) => {
        const stepNo = beatNo * stepsPerBeat + i;
        return <SequencerStep stepNo={stepNo} trackNo={trackNo} key={stepNo} />;
      })}
    </div>
  );
}

export default SequencerBeat;
