import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { ChakraProvider, Container, Divider } from "@chakra-ui/react";

import { defaultId } from "@Services/alert.service";

import { AlertContainer } from "@Components/AlertContainer";
import { Navbar } from "@Components/Navbar";

import { AboutView } from "@Pages/AboutView";
import Admin from "@Pages/admin/Admin";
import { ContactView } from "@Pages/ContactView";
import { Home } from "@Pages/Home";
import { PhotographyView } from "@Pages/PhotographyView";
import { ProjectView } from "@Pages/ProjectView";
import { NotFound } from "@Pages/NotFound";

import "./App.css";
import theme from "./theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Container
          position="relative"
          maxWidth="full"
          minHeight="full"
          marginBottom="-6rem"
          paddingBottom="6rem"
          paddingInline="auto"
        >
          <BrowserRouter>
            <Navbar />
            <Divider borderColor="white" marginX="1.25rem" width="auto" />
            <AlertContainer id={defaultId} />
            <Switch>
              <Route path="/about" exact component={AboutView} />
              <Route path="/admin" component={Admin} />
              <Route path="/contact" exact component={ContactView} />
              <Route path="/photography" exact component={PhotographyView} />
              <Route path="/project/:name" component={ProjectView} />
              <Route path="/" exact component={Home} />
              <Route path="*" component={NotFound} />
            </Switch>
          </BrowserRouter>
        </Container>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
