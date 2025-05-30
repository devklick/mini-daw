import Header from "./Header";
import SidePanel from "./SidePanel";
import TrackPropertiesPanel from "../TrackPropertiesPanel";
import SampleBrowserPanel from "../SampleBrowserPanel";
import Content from "./Content";
import "./Layout.scss";

function Layout() {
  return (
    <div className="layout">
      <Header />
      <div className="layout__row">
        <SidePanel side="left" title="Properties">
          <TrackPropertiesPanel />
        </SidePanel>
        <Content />
        <SidePanel side="right" title="Browser">
          <SampleBrowserPanel />
        </SidePanel>
      </div>
    </div>
  );
}

export default Layout;
