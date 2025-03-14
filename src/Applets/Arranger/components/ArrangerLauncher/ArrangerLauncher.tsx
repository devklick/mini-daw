import Applet from "../../../../components/Applet";
import Button from "../../../../components/Button";
import useAppletManagerStore from "../../../../stores/useAppletManagerStore";
import useSequencerStore from "../../../Sequencer/stores/useSequencerStore";
import Arranger from "../../Arranger";
import "./ArrangerLauncher.scss";

function ArrangerLauncher() {
  // Since the arranger can be considered as a  singleton, we can have a constant ID for it.
  const arrangerId = "arranger";
  const arranger = useAppletManagerStore((s) => s.applets[arrangerId]);
  const addApplet = useAppletManagerStore((s) => s.addApplet);
  const closeApplet = useAppletManagerStore((s) => s.closeApplet);
  const setSelectedTrack = useSequencerStore((s) => s.setSelectedTrack);

  function handleClick() {
    // Rather than showing and hiding the sequencer,  we close and open it.
    // This avoids the situation where the sequencer drag-bar & close button
    // are hidden behind another element and cant be accessed - the launcher
    // can be used to close and re-open, which re-initializes the position
    if (arranger) {
      closeApplet(arrangerId);
      return;
    }

    // If it hasn't been created, we need to create it.
    addApplet(arrangerId, {
      component: Applet,
      props: {
        id: arrangerId,
        initialDimensions: { height: "auto", width: 600 },
        initialPosition: { x: 0, y: 0 },
        title: "Arranger",
        onClose: () => setSelectedTrack(null),
        titleBarButtons: { close: true, max: true },
      },
      children: <Arranger />,
      key: arrangerId,
    });
  }
  return (
    <Button
      onClick={handleClick}
      backgroundColor="base4"
      size={{ height: "100%" }}
    >
      []
    </Button>
  );
}

export default ArrangerLauncher;
