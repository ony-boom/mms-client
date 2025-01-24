import { useRef, useEffect, useState, HTMLProps } from "react";

export function Cover({ src: baseSrc, alt }: CoverProps) {
  const [src, setSrc] = useState("");
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSrc(baseSrc);
        observer.unobserve(entry.target);
      }
    });

    if (imageContainerRef.current) {
      observer.observe(imageContainerRef.current);
    }

    return () => observer.disconnect();
  }, [baseSrc]);

  return (
    <div ref={imageContainerRef}>
      {src && (
        <img loading="lazy" className="animate-fade-in" src={src} alt={alt} />
      )}
    </div>
  );
}

export type CoverProps = HTMLProps<HTMLImageElement> & { src: string };
