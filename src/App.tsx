import React from 'react';
import Navbar from './components/navigation/Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SelectPlant from './components/pages/SelectPlant';
import SelectProject from './components/pages/SelectProject';
import { PlantContextProvider } from './contexts/PlantContext';
import { UserContextProvider } from './contexts/UserContext';
import SearchPage from './components/pages/SearchPage';
import GlobalStyles from './style/GlobalStyles';
import CommRouter from './CommRouter';

export type ParamTypes = {
    plant: string;
    project: string;
};

function App() {
    return (
        <GlobalStyles>
            <UserContextProvider>
                <Router>
                    <Navbar />
                    <Switch>
                        <Route exact path={'/'} component={SelectPlant} />
                        <Route path="/:plant" component={CommRouter} />
                        <Route render={() => <h1>404</h1>} />
                    </Switch>
                </Router>
            </UserContextProvider>
        </GlobalStyles>
    );
}

export default App;
