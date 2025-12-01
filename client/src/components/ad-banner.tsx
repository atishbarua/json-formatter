import { useEffect } from "react";

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

interface AdPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdClick?: () => void;
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      data-testid="ad-popup-overlay"
    >
      <div className="relative bg-card border border-card-border rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-close-popup"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        
        <div
          className="bg-muted/50 border border-dashed border-border rounded-md h-[250px] flex items-center justify-center cursor-pointer hover-elevate"
          onClick={() => {
            onAdClick?.();
            onClose();
          }}
          data-testid="ad-popup-content"
        >
          <div className="text-center text-muted-foreground">
            <p className="text-sm font-medium uppercase tracking-wide">Sponsored Content</p>
            <p className="text-xs mt-2">300x250 Ad Space</p>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          Click anywhere on the ad or close to continue
        </p>
      </div>
    </div>
  );
}
