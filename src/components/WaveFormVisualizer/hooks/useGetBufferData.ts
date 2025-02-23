import { useEffect, useState } from "react";

interface UseGetBufferDataParams {
  sampleUrl?: string;
  trackId?: string;
}

function useGetBufferData({ sampleUrl, trackId }: UseGetBufferDataParams) {
  const [bufferData, setBufferData] =
    useState<Float32Array<ArrayBufferLike> | null>(null);
  useEffect(() => {
    const fetchAudio = async () => {
      if (!sampleUrl) return;
      console.log("Fetching audio");
      const audioContext = new AudioContext();
      const response = await fetch(sampleUrl);
      const arrayBuffer = await response.arrayBuffer();
      const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const channelData = decodedBuffer.getChannelData(0);
      setBufferData(channelData);
    };

    fetchAudio();
  }, [sampleUrl]);

  useEffect(() => {}, [trackId]);

  return [bufferData] as const;
}

export default useGetBufferData;
