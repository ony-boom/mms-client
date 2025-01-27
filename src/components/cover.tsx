import {
  useRef,
  useEffect,
  useState,
  ReactNode,
  ElementRef,
  ImgHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

interface CoverProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  placeholder?: ReactNode;
  threshold?: number;
}

export function Cover({
  src: baseSrc,
  alt,
  placeholder,
  threshold = 0.05,
  className = "",
  ...imgProps
}: CoverProps) {
  const [src, setSrc] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imageContainerRef = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSrc(baseSrc);
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold },
    );

    const currentElement = imageContainerRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [baseSrc, threshold]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={imageContainerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {isVisible &&
        src && (
          <img
            {...imgProps}
            loading="lazy"
            src={src}
            alt={alt}
            onLoad={handleImageLoad}
            className={cn(
              "h-full w-full object-cover",
              isLoaded ? "animate-fade-in opacity-100" : "opacity-0",
              className,
            )}
          />
        )}
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 h-full w-full">{placeholder}</div>
      )}
    </div>
  );
}
