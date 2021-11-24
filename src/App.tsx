import { Switch, Route, BrowserRouter } from "react-router-dom";

import { defaultId } from "@Services/alert.service";

import { AlertContainer } from "@Components/AlertContainer";
import { Navbar } from "@Components/Navbar";

import { About } from "@Pages/About";
import Admin from "@Pages/admin/Admin";
import { Contact } from "@Pages/Contact";
import { Home } from "@Pages/Home";
import { Photography } from "@Pages/Photography";

import "./App.css";
import { Project } from "@Pages/Project";
import { NotFound } from "@Pages/NotFound";

export function App() {
  return (
    <div className="relative min-h-full -mb-24 pb-24">
      <BrowserRouter>
        <Navbar />
        <hr className="mx-5" />
        <AlertContainer id={defaultId} />
        <Switch>
          <Route path="/about" exact component={About} />
          <Route path="/admin" component={Admin} />
          <Route path="/contact" exact component={Contact} />
          <Route path="/photography" exact component={Photography} />
          <Route path="/project/:name" component={Project} />
          <Route path="/" exact component={Home} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
