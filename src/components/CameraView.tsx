import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff, Aperture } from "lucide-react";

interface Props {
  onCapture: (blob: Blob) => void;
}

export function CameraView({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Camera unavailable");
    }
  }

  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setActive(false);
  }

  useEffect(() => () => stop(), []);

  async function snap() {
    const v = videoRef.current;
    if (!v) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) onCapture(blob);
    }, "image/png");
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-ink/95">
      <div className="relative aspect-video w-full bg-ink">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
        />
        {/* Overlay frame */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-6 rounded-2xl border-2 border-teal/50" />
          {active && (
            <motion.div
              aria-hidden
              className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-teal to-transparent"
              animate={{ y: ["0%", "100%", "0%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>

        {!active && (
          <div className="absolute inset-0 grid place-items-center text-center text-powder/90">
            <div className="px-6">
              <Camera className="mx-auto mb-3 h-8 w-8 opacity-80" />
              <p className="text-sm">Live camera scanning</p>
              {error && (
                <p className="mt-3 text-xs text-coral/90">{error}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border/30 bg-ink px-4 py-3">
        {!active ? (
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-ink"
          >
            <Camera className="h-4 w-4" /> Enable camera
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-2 rounded-full border border-powder/30 px-4 py-2 text-sm text-powder"
          >
            <CameraOff className="h-4 w-4" /> Stop
          </button>
        )}
        <button
          type="button"
          onClick={snap}
          disabled={!active}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-coral px-5 py-2.5 text-sm font-semibold text-powder shadow-coral disabled:opacity-50"
        >
          <Aperture className="h-4 w-4" /> Capture
        </button>
      </div>
    </div>
  );
}
