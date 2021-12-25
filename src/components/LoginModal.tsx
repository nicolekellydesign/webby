import React, { useRef } from "react";

import {
  Button,
  Checkbox,
  FormControl,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";

import { Login } from "../declarations";

interface LoginElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
  remember: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginElements;
}

interface ILoginModalProps extends Object {
  login: (login: Login) => void;
}

export const LoginModal: React.FC<ILoginModalProps> = ({ login }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const onSubmit = (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { username, password, remember } = form.elements;

    login({ username: username.value, password: password.value, remember: remember.checked });
    form.reset();
  };

  return (
    <>
      <Link onClick={onOpen} width="100%" ref={finalRef}>
        Log In
      </Link>
      <Modal isOpen={isOpen} onClose={onClose} isCentered initialFocusRef={initialRef} finalFocusRef={finalRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Log In</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              id="login-form"
              onSubmit={onSubmit}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              style={{ padding: "1.5rem" }}
            >
              <Stack spacing="0.75rem">
                <FormControl isRequired>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    pattern="^(\w+)$"
                    isRequired
                    width="100%"
                    ref={initialRef}
                  />
                </FormControl>
                <FormControl isRequired>
                  <Input id="password" name="password" type="password" placeholder="Password" isRequired width="100%" />
                </FormControl>
                <FormControl>
                  <Checkbox id="remember" name="remember">
                    Remember me
                  </Checkbox>
                </FormControl>

                <Button id="submit" type="submit" variant="outline" margin={0} width="100%">
                  Log In
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
