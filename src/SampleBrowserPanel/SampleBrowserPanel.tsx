import SampleBrowserSearch from "./components/SampleBrowserSearch";

import "./SampleBrowserPanel.scss";
import SamplesList from "./components/SamplesList";

function SampleBrowserPanel() {
  return (
    <div className="sample-browser-panel">
      <SampleBrowserSearch />
      <SamplesList />
    </div>
  );
}

export default SampleBrowserPanel;
