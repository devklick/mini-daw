import { useEffect, useState } from "react";
import useSampleStore from "../../../Samples/stores/useSamplesStore";

interface UseGetBufferDataParams {
  sampleUrl?: string;
  trackId?: string;
  width: number;
  height: number;
}

function useComputeWaveformPoints({
  sampleUrl,
  trackId,
  height,
  width,
}: UseGetBufferDataParams) {
  const sampleBuffer = useSampleStore((s) => s.sampleBuffers[sampleUrl ?? ""]);
  const [points, setPoints] = useState<[number, number][]>([]);

  /**
   * Creates the points from a sample.
   * The AudioBuffer is used to compute the points without having to
   * add an AnalyserNode
   */
  useEffect(() => {
    const channelData = sampleBuffer.getChannelData(0);
    const samples = Math.floor(width * 2);
    const step = Math.max(1, Math.floor(channelData.length / samples));
    const updatedPoints: [number, number][] = [];

    for (let i = 0; i < samples; i++) {
      const sampleIndex = i * step;
      const amplitude = channelData[sampleIndex] || 0;

      const x = (i / samples) * width;
      const y = height / 2 + amplitude * (height / 2);

      updatedPoints.push([x, y]);
    }

    setPoints(updatedPoints);
  }, [height, sampleBuffer, width]);

  useEffect(() => {});

  return points;
}

export default useComputeWaveformPoints;
