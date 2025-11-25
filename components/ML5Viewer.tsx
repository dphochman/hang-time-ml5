'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window { ml5?: any }
}

type Props = {
  file: File | null;
  externalVideo?: HTMLVideoElement | null;  // NEW: the shared player
  minConfidence?: number;
};

export default function ML5Viewer({ file, minConfidence = 0.4 }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Load a video to begin');
  const poseRef = useRef<any | null>(null);
  const rafRef = useRef<number | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showKeypoints, setShowKeypoints] = useState(true);

  useEffect(() => {
    // console.debug('dph-1', {url, file})
    if (url) URL.revokeObjectURL(url);
    if (file) {
      const u = URL.createObjectURL(file);
      setUrl(u);
      setStatus('Loading model...');
      // console.debug('dph-loading-model', {u})
    } else {
      setUrl(null);
      setStatus('Load a video to begin');
    }
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [file]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !url) return;

    let destroyed = false;

    async function setup() {
      if (!window.ml5) {
        setStatus('ml5.js not loaded yet...');
        // console.debug('ml5.js not loaded yet');
        const t = setTimeout(() => { console.debug('dph-setup') }, 300);
        return () => clearTimeout(t);
      }
        // console.info('ml5.js is loaded');

      await new Promise<void>((resolve) => {
        // console.debug('dph-v', v, v?.readyState);
        if (v.readyState >= 1) return resolve();
        // v?.play();
        const onMeta = () => { v.removeEventListener('loadedmetadata', onMeta); resolve(); };
        v.addEventListener('loadedmetadata', onMeta);
      });

      // Ensure playback starts
      try { await v.play(); } catch { /* ignore autoplay rejections */ }

      const c = canvasRef.current;
      if (c) { c.width = v.videoWidth || 640; c.height = v.videoHeight || 360; }
      // console.debug('dph-c', {c})

      const poseNet = window.ml5.poseNet(v, { detectionType: 'single' }, () => {
        if (destroyed) return;
        setStatus('Model ready. Press play to analyze.');
      });

      poseNet.on('pose', (results: any[]) => {
        if (results && results[0]) poseRef.current = results[0].pose;
        // console.debug('dph-pose', results);
      });
    }

    setup();
    return () => { destroyed = true; if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [url]);

  useEffect(() => {
    function draw() {
      const v = videoRef.current, c = canvasRef.current, ctx = c?.getContext('2d');
      if (!v || !c || !ctx) { rafRef.current = requestAnimationFrame(draw); return; }

      try { ctx.drawImage(v, 0, 0, c.width, c.height); } catch {
        // console.error('dph-ctx', ctx);
      }

      const pose = poseRef.current;
      if (pose) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00ffff';
        ctx.fillStyle = '#00ffff';

        if (showKeypoints && Array.isArray(pose.keypoints)) {
          for (const kp of pose.keypoints) {
            if (kp.score >= minConfidence) {
              ctx.beginPath();
              ctx.arc(kp.position.x, kp.position.y, 4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        if (showSkeleton && Array.isArray(pose.keypoints)) {
          const byPart = (name: string) => pose.keypoints.find((k: any) => k.part === name);
          const link = (a: string, b: string) => {
            const ka = byPart(a), kb = byPart(b);
            if (ka && kb && ka.score >= minConfidence && kb.score >= minConfidence) {
              ctx.beginPath();
              ctx.moveTo(ka.position.x, ka.position.y);
              ctx.lineTo(kb.position.x, kb.position.y);
              ctx.stroke();
            }
          };
          link('leftShoulder','leftElbow'); link('leftElbow','leftWrist');
          link('rightShoulder','rightElbow'); link('rightElbow','rightWrist');
          link('leftShoulder','rightShoulder'); link('leftHip','rightHip');
          link('leftShoulder','leftHip'); link('rightShoulder','rightHip');
          link('leftHip','leftKnee'); link('leftKnee','leftAnkle');
          link('rightHip','rightKnee'); link('rightKnee','rightAnkle');
          link('nose','leftEye'); link('nose','rightEye');
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [minConfidence, showKeypoints, showSkeleton]);

  return (
    <div className="pose-container">
      <div className="pose-toolbar">
        <label><input type="checkbox" checked={showKeypoints} onChange={e=>setShowKeypoints(e.target.checked)} /> Keypoints</label>
        <label><input type="checkbox" checked={showSkeleton} onChange={e=>setShowSkeleton(e.target.checked)} /> Skeleton</label>
        <span className="status">{status}</span>
      </div>
      <div className="player-frame">
        {/* <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} /> */}
        {/* <video
          ref={videoRef}
          src={url ?? undefined}
          controls
          muted
          playsInline
          crossOrigin="anonymous"
          style={{ display: 'none' }}
        /> */}
        <img src="/column2b.png" />
      </div>
    </div>
  );
}
