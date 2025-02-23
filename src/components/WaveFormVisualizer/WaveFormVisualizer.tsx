import { useCallback, useEffect, useRef } from "react";
import "./WaveFormVisualizer.scss";
import useSampleStore from "../../Samples/stores/useSamplesStore";

interface WaveformVisualizerProps {
  url: string;
  width?: number | string;
  height?: number | string;
}
function WaveformVisualizer({ url, width = "100%" }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioBuffer = useSampleStore((s) => s.sampleBuffers[url]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      if (!audioBuffer) return;

      ctx.clearRect(0, 0, width, height);

      const channelData = audioBuffer.getChannelData(0);
      const samples = Math.floor(width * 2);
      const step = Math.max(1, Math.floor(channelData.length / samples));

      ctx.strokeStyle = "#9e42c2";
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let i = 0; i < samples; i++) {
        const sampleIndex = i * step;
        const amplitude = channelData[sampleIndex] || 0;

        const x = (i / samples) * width;
        const y = height / 2 + amplitude * (height / 2);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    },
    [audioBuffer]
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
