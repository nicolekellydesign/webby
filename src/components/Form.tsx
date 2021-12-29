import React from "react";

import { Button, ButtonGroup, Heading, VStack } from "@chakra-ui/react";

interface IFormProps extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  disabled?: boolean;
  hasReset?: boolean;
  header?: string;
  resetText?: string;
  submitText: string;
}

export const Form: React.FC<IFormProps> = ({
  children,
  disabled,
  hasReset,
  header,
  resetText,
  submitText,
  ...rest
}) => {
  const controls = hasReset ? (
    <ButtonGroup variant="outline" spacing={4} width={{ base: "full", lg: "auto" }}>
      <Button type="reset" disabled={disabled}>
        {resetText}
      </Button>
      <Button id="submit" type="submit" disabled={disabled} colorScheme="blue" width={{ base: "full", lg: "auto" }}>
        {submitText}
      </Button>
    </ButtonGroup>
  ) : (
    <ButtonGroup variant="outline" spacing={4} width={{ base: "full", lg: "auto" }}>
      <Button id="submit" type="submit" disabled={disabled} colorScheme="blue" width={{ base: "full", lg: "auto" }}>
        {submitText}
      </Button>
    </ButtonGroup>
  );

  return (
    <form {...rest}>
      {header && (
        <Heading as="h2" size="lg">
          {header}
        </Heading>
      )}

      <VStack spacing={4} marginY={4}>
        {children}
      </VStack>

      {controls}
    </form>
  );
};
