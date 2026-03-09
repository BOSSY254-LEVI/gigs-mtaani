import { useEffect, useState, type FC } from "react";

const DISPLAY_DURATION_MS = 2000;
const FADE_OUT_DURATION_MS = 400;

export const DotsLoader: FC = () => {
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;

    const displayTimer = setTimeout(() => {
      setFading(true);
      fadeTimer = setTimeout(() => setMounted(false), FADE_OUT_DURATION_MS);
    }, DISPLAY_DURATION_MS);

    return () => {
      clearTimeout(displayTimer);
      clearTimeout(fadeTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`dots-loader-overlay${fading ? " dots-loader-fade-out" : ""}`}
      role="status"
      aria-label="Loading"
    >
      <div className="dots-loader-content">
        <div className="dots-loader-dots" aria-hidden="true">
          <span className="dots-loader-dot" />
          <span className="dots-loader-dot" />
          <span className="dots-loader-dot" />
          <span className="dots-loader-dot" />
        </div>
        <p className="dots-loader-text">Loading...</p>
      </div>
    </div>
  );
};
