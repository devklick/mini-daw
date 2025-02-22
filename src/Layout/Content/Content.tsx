import React from "react";
import "./Content.scss";

interface ContentProps {
  children: React.ReactNode;
}
function Content({ children }: ContentProps) {
  return <main className="content">{children}</main>;
}

export default Content;
