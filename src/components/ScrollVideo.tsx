import { useEffect, useRef, useState } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4';
const POSTER_URL = '/hero-poster.jpg';

const MAX_FRAMES = 90;
const MAX_FRAME_WIDTH = 960;

function drawCover(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sw: number,
  sh: number,
  cw: number,
  ch: number,
) {
  if (!sw || !sh) return;
  const scale = Math.max(cw / sw, ch / sh);
  const w = sw * scale;
  const h = sh * scale;
  ctx.drawImage(source, (cw - w) / 2, (ch - h) / 2, w, h);
}

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<ImageBitmap[]>([]);
  const readyRef = useRef(false);
  const hasFrameRef = useRef(false);

  const [hasFrame, setHasFrame] = useState(false);
  const [cacheReady, setCacheReady] = useState(false);

  // Visible video: track when a decoded frame is available.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => {
      hasFrameRef.current = true;
      setHasFrame(true);
    };
    video.addEventListener('loadeddata', onLoaded);
    if (video.readyState >= 2) onLoaded();
    return () => video.removeEventListener('loadeddata', onLoaded);
  }, []);

  // Frame cache extraction via offscreen video.
  useEffect(() => {
    let cancelled = false;
    const visible = videoRef.current;

    const run = async () => {
      if (visible && visible.readyState < 2) {
        await new Promise<void>((res) => visible.addEventListener('loadeddata', () => res(), { once: true }));
      }
      await new Promise((r) => setTimeout(r, 300));
      if (cancelled) return;

      const off = document.createElement('video');
      off.muted = true;
      off.playsInline = true;
      off.preload = 'auto';
      off.crossOrigin = 'anonymous';
      off.src = VIDEO_URL;

      try {
        await new Promise<void>((res, rej) => {
          off.addEventListener('loadedmetadata', () => res(), { once: true });
          off.addEventListener('error', () => rej(new Error('video error')), { once: true });
        });
        if (cancelled) return;

        const duration = off.duration;
        if (!isFinite(duration) || duration <= 0) return;
        const count = Math.min(MAX_FRAMES, Math.max(24, Math.floor(duration * 12)));
        const vw = off.videoWidth || 1920;
        const vh = off.videoHeight || 1080;
        const w = Math.min(MAX_FRAME_WIDTH, vw);
        const h = Math.round((w * vh) / vw);

        const scratch = document.createElement('canvas');
        scratch.width = w;
        scratch.height = h;
        const sctx = scratch.getContext('2d');
        if (!sctx) return;

        const frames: ImageBitmap[] = [];
        for (let i = 0; i < count; i++) {
          if (cancelled) return;
          const t = (i / (count - 1)) * Math.max(0, duration - 0.05);
          await new Promise<void>((res) => {
            const onSeeked = () => res();
            off.addEventListener('seeked', onSeeked, { once: true });
            off.currentTime = t;
          });
          sctx.drawImage(off, 0, 0, w, h);
          frames.push(await createImageBitmap(scratch));
        }
        if (cancelled) {
          frames.forEach((f) => f.close());
          return;
        }
        framesRef.current = frames;
        readyRef.current = true;
        setCacheReady(true);
      } catch {
        // Frame cache unavailable (e.g. CORS) — fall back to seeking the visible video.
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll-scrubbing loop.
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    let target = 0;
    let smoothed = 0;
    const readProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    readProgress();
    smoothed = target;
    window.addEventListener('scroll', readProgress, { passive: true });

    let raf = 0;
    const tick = () => {
      smoothed += (target - smoothed) * 0.12;

      if (readyRef.current && framesRef.current.length) {
        const frames = framesRef.current;
        const idx = Math.min(frames.length - 1, Math.max(0, Math.round(smoothed * (frames.length - 1))));
        const frame = frames[idx];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCover(ctx, frame, frame.width, frame.height, canvas.width, canvas.height);
      } else if (video && hasFrameRef.current && isFinite(video.duration) && video.duration > 0) {
        const t = smoothed * (video.duration - 0.05);
        if (Math.abs(video.currentTime - t) > 0.04) {
          try {
            video.currentTime = t;
          } catch {
            /* ignore */
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', readProgress);
    };
  }, []);

  const videoVisible = hasFrame && !cacheReady;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a]">
      <img
        src={POSTER_URL}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          hasFrame || cacheReady ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          videoVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          cacheReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
