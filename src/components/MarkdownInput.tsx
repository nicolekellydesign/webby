import React, { useEffect, useState } from "react";

import { FormControl, FormLabel, FormHelperText, Textarea, Box } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Text, Heading, Link } from "@chakra-ui/layout";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IMarkdownInputProps extends Object {
  inputId?: string;
  inputName?: string;
  label?: string;
  startingText?: string;
}

export const MarkdownInput: React.FC<IMarkdownInputProps> = ({ inputId, inputName, label, startingText }) => {
  const [currentText, setCurrentText] = useState("");

  const labelElement = label && <FormLabel htmlFor={inputId}>{label}</FormLabel>;

  const markdownTheme = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p: (props: any) => {
      const { children } = props;
      return (
        <Text fontSize="medium" lineHeight="22px" marginBottom="1.5rem">
          {children}
        </Text>
      );
    },
  };

  useEffect(() => {
    setCurrentText(startingText || "");
  }, [setCurrentText, startingText]);

  return (
    <FormControl isRequired>
      {labelElement}
      <FormHelperText>
        <Text>
          You can use{" "}
          <Link
            href="https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
            isExternal
          >
            Github Flavored Markdown <ExternalLinkIcon marginX="0.125rem" />
          </Link>{" "}
          here.
        </Text>
      </FormHelperText>
      <Textarea
        id={inputId}
        name={inputName}
        defaultValue={startingText}
        onChange={(e) => {
          setCurrentText(e.target.value);
        }}
        onScroll={(e) => {
          const preview = document.getElementById("preview");
          if (preview) {
            preview.scrollTop = e.currentTarget.scrollTop;
          }
        }}
        height="24rem"
        resize="none"
      />

      {currentText && (
        <Box backgroundColor="gray.900" rounded="lg" marginTop={4}>
          <Heading
            as="h2"
            fontSize={20}
            fontWeight={600}
            lineHeight={1.75}
            opacity={0.4}
            paddingX={4}
            paddingTop={2}
            marginBottom={3}
          >
            Preview
          </Heading>
          <Box
            id="preview"
            opacity={0.4}
            overflowY="hidden"
            maxWidth="fit-content"
            maxHeight="24rem"
            textColor="lightgray"
            paddingLeft="1rem"
            paddingRight="2rem"
          >
            <ReactMarkdown components={ChakraUIRenderer(markdownTheme)} remarkPlugins={[remarkGfm]} skipHtml>
              {currentText}
            </ReactMarkdown>
          </Box>
        </Box>
      )}
    </FormControl>
  );
};
