import { Switch, Route, BrowserRouter } from "react-router-dom";

import { defaultId } from "./services/alert.service";

import AlertContainer from "./components/AlertContainer";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import About from "./pages/About";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Photography from "./pages/Photography";

import "./App.css";

function App() {
  return (
    <div className="relative min-h-full -mb-20 pb-20">
      <BrowserRouter>
        <Navbar />
        <hr className="line" />
        <AlertContainer id={defaultId} />
        <Switch>
          <Route path="/about" exact component={About} />
          <Route path="/admin" component={Admin} />
          <Route path="/contact" exact component={Contact} />
          <Route path="/photography" exact component={Photography} />
          <Route path="/" exact component={Home} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
