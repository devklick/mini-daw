import { useCallback, useEffect, useRef } from "react";
import useSampleStore from "../../Samples/stores/useSamplesStore";
import useComputeWaveformPoints from "./hooks/useComputeWaveformPoints";

import "./WaveFormVisualizer.scss";
interface WaveformVisualizerProps {
  url: string;
  width?: number | string;
  height?: number | string;
}
function WaveformVisualizer({ url, width = "100%" }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioBuffer = useSampleStore((s) => s.sampleBuffers[url]);
  const computePoints = useComputeWaveformPoints({
    sampleUrl: url,
  });

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      if (!audioBuffer) return;

      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "#9e42c2";
      ctx.lineWidth = 1;
      ctx.beginPath();

      const points = computePoints(width, height) ?? [];

      for (let i = 0; i < points.length; i++) {
        const [x, y] = points[i];
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    },
    [audioBuffer, computePoints]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        draw(ctx, width, height);
      }
    };
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, [draw]);

  return <canvas ref={canvasRef} style={{ width, aspectRatio: "16 / 9" }} />;
}

export default WaveformVisualizer;
