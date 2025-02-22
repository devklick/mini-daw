import React from "react";
import "./Content.scss";

interface ContentProps {
  children: React.ReactNode;
}
function Content({ children }: ContentProps) {
  return <div className="content">{children}</div>;
}

export default Content;
