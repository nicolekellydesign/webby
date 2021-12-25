import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      "html, body": {
        fontFamily: "Helvetica",
        color: "white",
        bg: "black",
      },
    },
  },
  fonts: {
    heading: "Helvetica",
    body: "Helvetica",
  },
});

export default theme;
