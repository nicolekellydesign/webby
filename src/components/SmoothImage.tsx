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
        <Box padding="8rem">
          <Spinner size="lg" />
        </Box>
      </Flex>
    );
  }

  if (errored) {
    return (
      <Flex alignItems="center" justifyContent="center" width="full" height="full">
        <Box padding="8rem">
          <Icon as={AiOutlineFileImage} width="4rem" height="4rem" />
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
