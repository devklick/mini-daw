import React from "react";
import "./Layout.scss";
import Header from "./Header";
import SidePanel from "./SidePanel";
import TrackPropertiesPanel from "../TrackPropertiesPanel";
import SampleBrowserPanel from "../SampleBrowserPanel";
import Content from "./Content";

interface LayoutProps {
  children?: React.ReactNode;
}
function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Header />
      <SidePanel side="left">
        <TrackPropertiesPanel />
      </SidePanel>
      <SidePanel side="right">
        <SampleBrowserPanel />
      </SidePanel>
      <Content>{children}</Content>
    </div>
  );
}

export default Layout;
