import { useRef } from "react";
import Applet from "../../../../components/Applet";
import Sequencer from "../../../../Sequencer";
import useAppletManagerStore from "../../../../stores/useAppletManagerStore";
import useSequencerStore from "../../../../Sequencer/stores/useSequencerStore";

import SequencerIcon from "./assets/sequencer-icon.svg?react";
import "./SequencerLauncher.scss";
import Button from "../../../../components/Button";

function SequencerLauncher() {
  // Since the sequencer is a singleton, we can have a constant ID for it.
  const sequencerId = "sequencer";
  const sequencer = useAppletManagerStore((s) => s.applets[sequencerId]);
  const addApplet = useAppletManagerStore((s) => s.addApplet);
  const closeApplet = useAppletManagerStore((s) => s.closeApplet);
  const setSelectedTrack = useSequencerStore((s) => s.setSelectedTrack);
  function handleClick() {
    // If the applet has already been created,
    // the launcher button is used to either hide or show the applet.
    if (sequencer) {
      closeApplet(sequencerId);
      return;
    }

    // If it hasn't been created, we need to create it.
    addApplet(sequencerId, {
      component: Applet,
      props: {
        id: sequencerId,
        initialDimensions: { height: "auto", width: 600 },
        initialPosition: { x: 0, y: 0 },
        title: "Sequencer",
        onClose: () => setSelectedTrack(null),
      },
      children: <Sequencer />,
      key: sequencerId,
    });
  }
  return (
    <Button
      onClick={handleClick}
      backgroundColor="base4"
      size={{ height: "100%" }}
    >
      <SequencerIcon width={"100%"} height={"100%"} />
    </Button>
  );
}

export default SequencerLauncher;
