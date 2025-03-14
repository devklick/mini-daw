import Applet from "../../../../components/Applet";
import Sequencer from "../../../../Sequencer";
import Button from "../../../../components/Button";
import useAppletManagerStore from "../../../../stores/useAppletManagerStore";
import useSequencerStore from "../../../../Sequencer/stores/useSequencerStore";

import SequencerIcon from "./assets/sequencer-icon.svg?react";

import "./SequencerLauncher.scss";

function SequencerLauncher() {
  // Since the sequencer can be considered as a  singleton, we can have a constant ID for it.
  const sequencerId = "sequencer";
  const sequencer = useAppletManagerStore((s) => s.applets[sequencerId]);
  const addApplet = useAppletManagerStore((s) => s.addApplet);
  const closeApplet = useAppletManagerStore((s) => s.closeApplet);
  const setSelectedTrack = useSequencerStore((s) => s.setSelectedTrack);

  function handleClick() {
    // Rather than showing and hiding the sequencer,  we close and open it.
    // This avoids the situation where the sequencer drag-bar & close button
    // are hidden behind another element and cant be accessed - the launcher
    // can be used to close and re-open, which re-initializes the position
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
      <SequencerIcon
        width={"100%"}
        height={"100%"}
        className="sequencer-launcher__icon"
      />
    </Button>
  );
}

export default SequencerLauncher;
