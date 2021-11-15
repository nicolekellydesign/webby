import { Switch, Route, BrowserRouter } from "react-router-dom";

import { defaultId } from "./services/alert.service";

import { AlertContainer } from "./components/AlertContainer";
import { Navbar } from "./components/Navbar";

import { About } from "./pages/About";
import Admin from "./pages/admin/Admin";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { Photography } from "./pages/Photography";

import "./App.css";
import { Project } from "./pages/Project";
import { NotFound } from "./pages/NotFound";

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
