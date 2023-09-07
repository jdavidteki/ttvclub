import React, { Component, lazy, Suspense } from 'react';
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom';
import Layout from "./components/Layout/Layout.js"
import "./App.css";

const Router = process.env.NODE_ENV === 'production' ? HashRouter : BrowserRouter;

//textyng - bhe everytingg
window.onresize = function() {
  document.getElementsByClassName("App").height = window.innerHeight;
}
window.onresize();

// Use React.lazy to dynamically import the Layout component
const LayoutLazy = lazy(() => import("./components/Layout/Layout.js"));

class App extends Component {
  render() {
    return (
        <Router>
            <div className="App">
                <div className="App-content">
                    <Suspense fallback={<div>Loading...</div>}>
                        <Switch>
                            <Route path="/ttvclub" exact component={() => (<LayoutLazy pageName="ttvclub" />)} />
                        </Switch>
                    </Suspense>
                </div>
            </div>
        </Router>
    );
  }
}

export default App;
