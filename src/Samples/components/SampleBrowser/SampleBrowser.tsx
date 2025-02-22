import { useRef } from "react";
import useSampleStore, { useAddSamples } from "../../stores/useSamplesStore";
import useDndStore from "../../../components/DragAndDrop/stores/useDndStore";

import "./SampleBrowser.scss";

function SampleBrowser() {
  const dnd = useDndStore();
  const activeSample = useRef<{ id: string; audio: HTMLAudioElement }>(null);
  const samples = useSampleStore((s) => s.samples);
  const addSamples = useAddSamples();

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    addSamples(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div
      className="sample-browser"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2>Sample Browser</h2>
      <span>Drop files here</span>
      <ul className="sample-list">
        {Object.values(samples).map((sample, i) => (
          <li className="sample" key={i}>
            <span
              draggable
              onDragStart={() => dnd.setDragging(sample.id, "sample")}
              onDragEnd={() => dnd.clearDragging()}
            >
              {sample.name}
            </span>
            <span>{sample.length}</span>
            <span>{sample.instrument}</span>
            <span>{sample.pattern}</span>
            <button
              onClick={() => {
                // Click and dirty test of samples in browser
                if (activeSample.current) activeSample.current.audio.pause();
                activeSample.current = {
                  id: sample.id,
                  audio: new Audio(sample.url),
                };
                activeSample.current.audio.play();
              }}
            >
              Play/Stop
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SampleBrowser;
