import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Photography from './pages/Photography';
import './App.css';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" exact component={About} />
          <Route path="/contact" exact component={Contact} />
          <Route path="/photography" exact component={Photography} />
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
