import { useRef } from "react";
import Applet from "../../../../components/Applet";
import Sequencer from "../../../../Sequencer";
import useAppletManagerStore from "../../../../stores/useAppletManagerStore";
import "./SequencerLauncher.scss";

function SequencerLauncher() {
  const sequencerIdRef = useRef(crypto.randomUUID());
  const sequencer = useAppletManagerStore(
    (s) => s.applets[sequencerIdRef.current]
  );
  const addApplet = useAppletManagerStore((s) => s.addApplet);
  const toggleHide = useAppletManagerStore((s) => s.toggleHide);
  function handleClick() {
    // If the applet has already been created,
    // the launcher button is used to either hide or show the applet.
    if (sequencer) {
      toggleHide(sequencerIdRef.current);
      return;
    }

    // If it hasn't been created, we need to create it.
    addApplet(sequencerIdRef.current, {
      component: Applet,
      props: {
        id: sequencerIdRef.current,
        initialDimensions: { height: "auto", width: 600 },
        initialPosition: { x: 0, y: 0 },
        title: "Sequencer",
      },
      children: <Sequencer />,
      key: sequencerIdRef.current,
    });
  }
  return (
    <button className={"sequencer-launcher"} onClick={handleClick}></button>
  );
}

export default SequencerLauncher;
