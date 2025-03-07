import { useSequencer } from "../../Sequencer/stores/useSequencerStore";
import useBindKeyToAction from "./useBindKeyToAction";

function usePlayControls() {
  const { togglePlayStop } = useSequencer();

  useBindKeyToAction({
    keys: ["Space"],
    actions: [togglePlayStop],
  });

  return { togglePlayStop };
}

export default usePlayControls;
