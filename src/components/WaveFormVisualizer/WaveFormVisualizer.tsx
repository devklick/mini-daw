import { useCallback, useEffect, useRef, useState } from "react";
import "./WaveFormVisualizer.scss";

interface WaveformVisualizerProps {
  url: string;
  width?: number | string;
  height?: number | string;
}
function WaveformVisualizer({ url, width = "100%" }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  // TODO: WIP - need to update this to work for samples and tracks.
  // Track waveform visualizations should take into account the volume, pan & pitch of the track
  // Ideally we shouldnt need to fetch the audio multiple times. This is already done in useSequencer,
  // however perhaps it should be done on init and stored in the useSequencerStore
  useEffect(() => {
    const fetchAudio = async () => {
      const audioContext = new AudioContext();
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
      setAudioBuffer(decodedBuffer);
    };

    fetchAudio();
  }, [url]);

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
      console.log({
        canvas: {
          width: canvas.width,
          height: canvas.height,
          style: { width, height },
        },
      });
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
