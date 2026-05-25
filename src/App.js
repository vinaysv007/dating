import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Landing from './components/pages/Landing';
import Home from './components/pages/Home';
import Navigation from './components/pages/Navigation';

import './components/css/Styles.scss';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Navigation/>
                <Switch>
                    <React.Fragment>
                        <Route path="/" exact component={Landing} />
                        <Route path="/Home" component={Home} />
                    </React.Fragment>
                    <Route />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default App;