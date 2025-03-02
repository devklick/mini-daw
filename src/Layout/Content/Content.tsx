import React, { useEffect } from "react";
import "./Content.scss";
import useAppletManagerStore from "../../stores/useAppletManagerStore";
import Applet from "../../components/Applet";
import Sequencer from "../../Sequencer";

interface ContentProps {
  // children: React.ReactNode;
}
function Content({}: // children
ContentProps) {
  // const getAppletDefinitions = useAppletManagerStore(
  //   (s) => s.getAppletDefinitions
  // );
  const addApplet = useAppletManagerStore((s) => s.addApplet);
  const appletMap = useAppletManagerStore((s) => s.appletMap);

  useEffect(() => {
    console.log("useEffect, applets", appletMap);
  }, [appletMap]);

  function test() {
    const id = crypto.randomUUID();
    console.log("Adding applet");
    addApplet(id, {
      component: Applet,
      props: {
        id,
        initialDimensions: { height: "auto", width: 600 },
        initialPosition: { x: 0, y: 0 },
        title: "Sequencer",
      },
      children: <Sequencer />,
      key: id,
    });
  }
  return (
    <main className="content">
      <button onClick={test}>test</button>
      {Array.from(appletMap.values()).map((definition) => (
        <definition.component {...definition.props} key={definition.key}>
          {definition.children}
        </definition.component>
      ))}
    </main>
  );
}

export default Content;
