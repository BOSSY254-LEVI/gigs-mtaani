import { useEffect, useState, type FC } from "react";

const FADE_OUT_DURATION_MS = 400;

interface PreloaderProps {
  visible: boolean;
}

export const Preloader: FC<PreloaderProps> = ({ visible }) => {
  const [mounted, setMounted] = useState(visible);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setFading(false);
    } else {
      setFading(true);
      const timer = setTimeout(() => setMounted(false), FADE_OUT_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <div className={`preloader-overlay${fading ? " preloader-fade-out" : ""}`}>
      <div className="preloader-content">
        <div className="preloader-spinner" aria-hidden="true" />
        <p className="preloader-text">Please wait...</p>
      </div>
    </div>
  );
};
