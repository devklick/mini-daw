import { useCallback } from "react";
import useSampleStore from "../../../Samples/stores/useSamplesStore";

interface UseGetBufferDataParams {
  sampleUrl?: string;
  trackId?: string;
}

function useComputeWaveformPoints({ sampleUrl }: UseGetBufferDataParams) {
  const sampleBuffer = useSampleStore((s) => s.sampleBuffers[sampleUrl ?? ""]);

  /**
   * Creates the points from a sample.
   * The AudioBuffer is used to compute the points without having to
   * add an AnalyserNode
   */
  return useCallback(
    (width: number, height: number) => {
      if (!sampleBuffer) return;
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

      return updatedPoints;
    },
    [sampleBuffer]
  );
}

export default useComputeWaveformPoints;
