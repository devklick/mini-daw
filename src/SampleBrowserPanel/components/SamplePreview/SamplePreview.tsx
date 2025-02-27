import WaveformVisualizer from "../../../components/WaveFormVisualizer";
import useSampleStore from "../../../Samples/stores/useSamplesStore";
import "./SamplePreview.scss";

function SamplePreview() {
  const sampleUrl = useSampleStore((s) => s.selectedSampleUrl);
  return (
    <div className="sample-preview">
      {sampleUrl && <WaveformVisualizer url={sampleUrl} playOnClick={true} />}
    </div>
  );
}

export default SamplePreview;
