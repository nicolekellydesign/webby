import React, { useCallback, useState } from "react";
import { AiOutlineFileImage, AiOutlineLoading } from "react-icons/ai";

interface ISmoothImageProps extends Object {
  src: string;
  alt: string;
}

export const SmoothImage: React.FC<ISmoothImageProps> = ({ src, alt, children }) => {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const onLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const onError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    setErrored(true);
  }, []);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <img src={src} alt={alt} onLoad={onLoad} onError={onError} style={{ display: "none" }} />
        <div className="p-32">
          <AiOutlineLoading className="animate-spin stroke-current w-16 h-16" />
        </div>
      </div>
    );
  }

  if (errored) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="p-32">
          <AiOutlineFileImage className="stroke-current w-16 h-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <img src={src} alt={alt} onLoad={onLoad} onError={onError} className="w-full h-auto" />
      {children}
    </div>
  );
};
