import { useEffect } from "react";

interface AdPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdClick?: () => void;
}
interface AdBannerProps {
  position: "top" | "bottom" | "sidebar";
  onAdClick?: () => void;
}

export function AdBanner({ position, onAdClick }: AdBannerProps) {
  const dimensions = {
    top: "h-[90px] w-full max-w-[728px]",
    bottom: "h-[90px] w-full max-w-[728px]",
    sidebar: "h-[600px] w-[160px]",
  };

  const handleClick = () => {
    onAdClick?.();
  };

  return (
    <div
      className={`${dimensions[position]} bg-muted/50 border border-dashed border-border rounded-md flex items-center justify-center cursor-pointer hover-elevate transition-colors`}
      onClick={handleClick}
      data-testid={`ad-banner-${position}`}
    >
      <div className="text-center text-muted-foreground">
        <p className="text-xs font-medium uppercase tracking-wide">Advertisement</p>
        <p className="text-xs mt-1">
          {position === "sidebar" ? "160x600" : "728x90"}
        </p>
      </div>
    </div>
  );
}


export function AdPopup({ isOpen, onClose, onAdClick }: AdPopupProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Push ad after rendering
  useEffect(() => {
    if (isOpen) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense push error:", e);
      }
    }
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      data-testid="ad-popup-overlay"
    >
      <div className="relative bg-card border border-card-border rounded-lg p-6 max-w-md w-full mx-4 shadow-lg flex flex-col items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          ✕
        </button>

        <ins
          className="adsbygoogle"
          style={{ display: "block", width: 300, height: 250 }}
          data-ad-client="ca-pub-6408060974768823"
          data-ad-slot="6608671761"
        />

        <p className="text-xs text-muted-foreground text-center mt-4">
          Click anywhere on the ad or close to continue
        </p>
      </div>
    </div>
  );
}
