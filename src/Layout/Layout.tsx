import React from "react";

import Header from "./Header";
import SidePanel from "./SidePanel";
import TrackPropertiesPanel from "../TrackPropertiesPanel";
import SampleBrowserPanel from "../SampleBrowserPanel";
import Content from "./Content";
import "./Layout.scss";

interface LayoutProps {
  children?: React.ReactNode;
}
function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Header />
      <div className="layout__row">
        <SidePanel side="left">
          <TrackPropertiesPanel />
        </SidePanel>
        <Content>{children}</Content>
        <SidePanel side="right">
          <SampleBrowserPanel />
        </SidePanel>
      </div>
    </div>
  );
}

export default Layout;
