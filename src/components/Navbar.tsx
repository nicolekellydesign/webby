import React, { useEffect } from "react";
import { useHistory, Link as ReactLink, useLocation } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";

import {
  Box,
  Collapse,
  Flex,
  IconButton,
  Image,
  Link,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";

import { LoginModal } from "@Components/LoginModal";
import { LoadingCard } from "@Components/LoadingCard";
import { adminNavbarData } from "@Components/adminNavbarData";
import { NavbarData } from "@Components/navbarData";
import "@Components/Navbar.css";
import logo from "@Icons/logo_white.png";

import { alertService } from "@Services/alert.service";
import { SessionQuery } from "../Queries";
import { APIError, Login, Session } from "../declarations";

export const Navbar: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const queryClient = useQueryClient();
  const history = useHistory();
  const location = useLocation();
  const isAdminRoute = location.pathname.includes("/admin");

  const sessionQuery = useQuery("session", SessionQuery, { refetchOnMount: "always" });

  const loginMutation = useMutation(
    async (login: Login) => {
      await queryClient.cancelQueries("session");
      return axios.post("/api/v1/login", login);
    },
    {
      onSuccess: () => {
        alertService.success("Logged in successfully", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;

        if (err.code === 401) {
          alertService.warn("Invalid login credentials", false);
        } else {
          console.error("error sending login request", { err });
          alertService.error(`Error trying to log in: ${err.message}`, false);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries("session");
      },
    }
  );

  const logoutMutation = useMutation(
    async () => {
      await queryClient.cancelQueries("session");
      return axios.post("/api/v1/logout");
    },
    {
      onSuccess: () => {
        alertService.success("Logged out successfully", true);
        history.push("/admin");
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error("error sending logout request", { err });
        alertService.error(`Error trying to log out: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("session");
      },
    }
  );

  // Use a history hook to toggle the nav menu closed on nav change
  useEffect(() => {
    const historyUnlisten = history.listen(() => {
      if (isOpen) {
        onToggle();
      }
    });

    return () => {
      historyUnlisten();
    };
  });

  if (sessionQuery.isLoading) {
    return <LoadingCard />;
  }

  const session = sessionQuery.data as Session;

  return (
    <nav>
      <Flex alignItems="center" width="full" height="150px" padding="1.25rem">
        <Box flex="1 1 0%">
          <Image alt="Nicole Kelly Design" src={logo} width="115px" height="115px" />
        </Box>

        <Box flex="none" display={{ base: "none", lg: "block" }} alignSelf="flex-end">
          <List display="inline-flex" flexDirection="row">
            {NavbarData.map((item, idx) => (
              <ListItem
                key={idx}
                fontWeight="light"
                textTransform="lowercase"
                textDecoration="none"
                padding={0}
                position="relative"
              >
                <Link as={ReactLink} to={item.path} paddingX="1.25rem" paddingY="0.75rem" className="navbar-link">
                  {item.title}
                </Link>
              </ListItem>
            ))}

            {isAdminRoute && (
              <ListItem fontWeight="light" textDecoration="none" padding={0} position="relative">
                <Menu>
                  <MenuButton as={ReactLink} to="#" className="navbar-link" style={{ padding: "0.75rem 1.25rem" }}>
                    admin
                  </MenuButton>
                  <MenuList>
                    <MenuGroup title="Admin Pages">
                      {adminNavbarData.map(
                        (item, idx) =>
                          ((item.privileged && session.valid) || !item.privileged) && (
                            <MenuItem key={idx} as={ReactLink} to={item.path}>
                              {item.title}
                            </MenuItem>
                          )
                      )}
                    </MenuGroup>
                    <MenuDivider />
                    {session.valid ? (
                      <MenuItem as={ReactLink} to="/admin" onClick={() => logoutMutation.mutate()}>
                        Logout
                      </MenuItem>
                    ) : (
                      <MenuItem>
                        <LoginModal login={loginMutation.mutate} />
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              </ListItem>
            )}
          </List>
        </Box>

        <IconButton
          aria-label="Toggle menu"
          as={isOpen ? AiOutlineClose : AiOutlineMenu}
          display={{ base: "block", lg: "none" }}
          size="md"
          onClick={onToggle}
          variant="ghost"
        />
      </Flex>

      <Collapse in={isOpen} animate>
        <List padding="4px" width="full">
          {NavbarData.map((item, index) => (
            <ListItem key={index} fontWeight="light" textDecoration="none" textAlign="center" paddingY="0.75rem">
              <Link as={ReactLink} to={item.path} className="navbar-link">
                {item.title}
              </Link>
            </ListItem>
          ))}

          {isAdminRoute && (
            <>
              <MenuDivider />
              <MenuGroup title="Admin Pages">
                {adminNavbarData.map(
                  (item, idx) =>
                    ((item.privileged && session.valid) || !item.privileged) && (
                      <ListItem
                        key={idx}
                        fontWeight="light"
                        textDecoration="none"
                        textAlign="center"
                        paddingY="0.75rem"
                      >
                        <Link as={ReactLink} to={item.path} className="navbar-link">
                          {item.title}
                        </Link>
                      </ListItem>
                    )
                )}
              </MenuGroup>

              <MenuDivider />
              <ListItem fontWeight="light" textDecoration="none" textAlign="center" paddingY="0.75rem">
                {session.valid ? (
                  <Link to="/admin" onClick={() => logoutMutation.mutate()} width="full">
                    Logout
                  </Link>
                ) : (
                  <LoginModal login={loginMutation.mutate} />
                )}
              </ListItem>
            </>
          )}
        </List>
      </Collapse>
    </nav>
  );
};
