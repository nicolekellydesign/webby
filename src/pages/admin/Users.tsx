import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import {
  Container,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  ModalFooter,
  Button,
  Tooltip,
  IconButton,
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

import { Card, CardBody } from "@Components/Card";
import { LoadingCard } from "@Components/LoadingCard";
import { alertService } from "@Services/alert.service";
import { User } from "../../declarations";
import { UsersQuery } from "../../Queries";

interface LoginElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
  confirm: HTMLInputElement;
  submit: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginElements;
}

interface AddUserReq extends Object {
  username: string;
  password: string;
}

export const AdminUsers: React.FC = () => {
  const queryClient = useQueryClient();
  const usersQuery = useQuery("users", UsersQuery);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [activeID, setActiveID] = useState(0);

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const handleShowClick = () => setShow(!show);
  const handleShowConfirmClick = () => setShowConfirm(!showConfirm);

  const handleDeleteClick = (id: number) => {
    setActiveID(id);
    onOpen();
  };

  const addUserMutation = useMutation(
    (data: AddUserReq) => {
      return axios.post("/api/v1/admin/users", data);
    },
    {
      onSuccess: () => {
        alertService.success("User added successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err = error.response?.data;
        console.error("error adding user", { err });
        alertService.error(`Error adding user: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("users");
        window.scrollTo(0, 0);
      },
    }
  );

  const deleteUserMutation = useMutation(
    (id: number) => {
      return axios.delete(`/api/v1/admin/users/${id}`);
    },
    {
      onSuccess: () => {
        alertService.success("User deleted successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err = error.response?.data;
        console.error("error deleting user", { err });
        alertService.error(`Error deleting user: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("users");
        window.scrollTo(0, 0);
      },
    }
  );

  const handleSubmit = (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();

    setUsernameError("");
    setConfirmError("");

    const form = event.currentTarget;
    const { username, password, confirm } = form.elements;

    // Validate the inputs
    const usernameInput = username.value;
    const passwordInput = password.value;
    const confirmInput = confirm.value;
    let errored = false;

    if (!usernameInput.match(/^(\w+)$/g)) {
      errored = true;
      setUsernameError("Username cannot contain spaces!");
    }

    if (passwordInput !== confirmInput) {
      errored = true;
      setConfirmError("Passwords do not match!");
    }

    if (errored) {
      return;
    }

    // Send the data to the backend
    addUserMutation.mutate({ username: username.value, password: password.value });
    form.reset();
  };

  if (usersQuery.isLoading) {
    return <LoadingCard />;
  }

  if (usersQuery.isError) {
    console.error("Error fetching users", usersQuery.error);
    alertService.error(`Error getting users: ${usersQuery.error}`, false);
  }

  const users = (usersQuery.data as User[]).sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    } else if (a.id > b.id) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <Container>
      <Heading as="h1" textAlign="center">
        Admin Users
      </Heading>

      <Table marginTop="2rem">
        <TableCaption>Registered administrators</TableCaption>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Username</Th>
            <Th>Created At</Th>
            <Th>Last Login</Th>
            <Th>Sessions</Th>
            <Th></Th>
          </Tr>
        </Thead>

        <Tbody>
          {users.map((user, idx) => (
            <Tr key={idx}>
              <Th>{user.id}</Th>
              <Td>{user.username}</Td>
              <Td>
                {new Date(user.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "medium",
                })}
              </Td>
              <Td>
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "medium",
                    })
                  : "n/a"}
              </Td>
              <Td>{user.sessions}</Td>
              <Td>
                {user.protected ? (
                  <Tooltip label="User is protected">
                    <IconButton icon={<CloseIcon />} aria-label="Delete user" variant="ghost" disabled />
                  </Tooltip>
                ) : (
                  <>
                    <Tooltip label="Delete user">
                      <IconButton
                        icon={<CloseIcon />}
                        aria-label="Delete user"
                        variant="ghost"
                        onClick={() => {
                          handleDeleteClick(user.id);
                        }}
                      />
                    </Tooltip>
                    <Modal id={`delete-${activeID}-modal`} isOpen={isOpen} onClose={onClose} isCentered>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Delete User</ModalHeader>

                        <ModalBody>
                          <Text>
                            Are you sure you want to delete user &apos;
                            {users.find((user) => user.id === activeID)?.username}
                            &apos;?
                          </Text>
                          <Text>This action cannot be reversed.</Text>
                        </ModalBody>

                        <ModalFooter>
                          <Button variant="outline" marginRight="1rem" onClick={onClose}>
                            Cancel
                          </Button>
                          <Button
                            variant="outline"
                            colorScheme="red"
                            onClick={() => {
                              deleteUserMutation.mutate(activeID);
                              onClose();
                            }}
                          >
                            Delete
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Card marginTop="2rem">
        <CardBody>
          <Heading as="h2" size="md" marginBottom="1rem">
            Add User
          </Heading>

          <form id="addUser" onSubmit={handleSubmit}>
            <VStack spacing="1rem">
              <FormControl isInvalid={usernameError !== ""} isRequired>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  title="Username cannot contain whitespace"
                />
                <FormErrorMessage>{usernameError}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={confirmError !== ""} isRequired>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <Input id="password" name="password" type={show ? "text" : "password"} placeholder="Password" />
                  <InputRightElement width="4.5rem">
                    <Button height="1.75rem" size="sm" onClick={handleShowClick}>
                      {show ? "hide" : "show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isInvalid={confirmError !== ""} isRequired>
                <FormLabel htmlFor="confirm">Confirm password</FormLabel>
                <InputGroup>
                  <Input id="confirm" name="confirm" type={showConfirm ? "text" : "password"} placeholder="Password" />
                  <InputRightElement width="4.5rem">
                    <Button height="1.75rem" size="sm" onClick={handleShowConfirmClick}>
                      {showConfirm ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{confirmError}</FormErrorMessage>
              </FormControl>

              <Button id="submit" type="submit" variant="outline" colorScheme="blue">
                Add user
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};
