import SampleBrowserSearch from "./components/SampleBrowserSearch";

import SamplesList from "./components/SamplesList";
import DropZone from "../components/DragAndDrop/DropZone/DropZone";
import { useAddSamples } from "../Samples/stores/useSamplesStore";

import "./SampleBrowserPanel.scss";

function SampleBrowserPanel() {
  const addSamples = useAddSamples();

  const handleDropFiles = (files: FileList) => {
    addSamples(files);
  };
  return (
    <div className="sample-browser-panel">
      <SampleBrowserSearch />
      <DropZone onDropFiles={handleDropFiles}>
        <SamplesList />
      </DropZone>
    </div>
  );
}

export default SampleBrowserPanel;
