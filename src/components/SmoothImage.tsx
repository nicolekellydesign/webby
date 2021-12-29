import React, { useCallback, useState } from "react";
import { AiOutlineFileImage } from "react-icons/ai";

import { Box, Flex, Icon, Image, Spinner } from "@chakra-ui/react";

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
      <Flex alignItems="center" justifyContent="center" width="full" height="full">
        <Image alt={alt} src={src} loading="lazy" onLoad={onLoad} onError={onError} style={{ display: "none" }} />
        <Box padding={32}>
          <Spinner size="lg" />
        </Box>
      </Flex>
    );
  }

  if (errored) {
    return (
      <Flex alignItems="center" justifyContent="center" width="full" height="full">
        <Box padding={32}>
          <Icon as={AiOutlineFileImage} width={16} height={16} />
        </Box>
      </Flex>
    );
  }

  return (
    <Box position="relative" width="full" height="full">
      <Image alt={alt} src={src} loading="lazy" onLoad={onLoad} onError={onError} width="full" height="full" />
      {children}
    </Box>
  );
};
