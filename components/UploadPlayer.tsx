'use client';

import { useRef, useState, useEffect } from 'react';

export default function UploadPlayer({
  onFile,
  onDuration,
  onVideoEl,
}: {
  onFile: (f: File | null) => void,
  onDuration: (d: number) => void,
  onVideoEl?: (el: HTMLVideoElement | null) => void,
}) {
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    }
  }, [previewURL]);

    useEffect(() => {
    onVideoEl?.(videoRef.current || null);
    return () => onVideoEl?.(null);
  }, [onVideoEl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    onFile(f);
    if (f) {
      // const url = URL.createObjectURL(f);
      const url = "/IMG_8262.MOV"
      setPreviewURL(url);
      setTimeout(() => {
        const v = videoRef.current;
        if (v && !isNaN(v.duration)) {
          onDuration(v.duration);
        }
      }, 100);
    } else {
      setPreviewURL(null);
    }
  };

  const onLoadedMetadata = () => {
    const v = videoRef.current;
    if (v && !isNaN(v.duration)) {
      onDuration(v.duration);
    }
  };

  return (
    <div className="upload">
      <input
        type="file"
        accept="video/*"
        onChange={handleChange}
        aria-label="Upload jump video"
      />
      <div className="player-frame">
        {previewURL ? (
          <video
            ref={videoRef}
            src={previewURL}
            controls
            autoPlay
            onLoadedMetadata={onLoadedMetadata}
            playsInline
          />
        ) : (
          <div className="placeholder">Your uploaded video will appear here.</div>
        )}
      </div>
    </div>
  );
}
