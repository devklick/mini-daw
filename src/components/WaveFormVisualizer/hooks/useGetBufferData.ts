import { useEffect, useState } from "react";
import { useAudioContext } from "../../../stores/useDawStore";

interface UseGetBufferDataParams {
  sampleUrl?: string;
  trackId?: string;
}

function useGetBufferData({ sampleUrl, trackId }: UseGetBufferDataParams) {
  const audioContext = useAudioContext();
  const [bufferData, setBufferData] =
    useState<Float32Array<ArrayBufferLike> | null>(null);
  useEffect(() => {
    const fetchAudio = async () => {
      if (!sampleUrl) return;
      console.log("Fetching audio");
      const response = await fetch(sampleUrl);
      const arrayBuffer = await response.arrayBuffer();
      const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const channelData = decodedBuffer.getChannelData(0);
      setBufferData(channelData);
    };

    fetchAudio();
  }, [audioContext, sampleUrl]);

  useEffect(() => {}, [trackId]);

  return [bufferData] as const;
}

export default useGetBufferData;
