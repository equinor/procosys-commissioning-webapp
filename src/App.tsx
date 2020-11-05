import React from 'react';
import Navbar from './components/navigation/Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SelectPlant from './components/pages/SelectPlant';
import SelectProject from './components/pages/SelectProject';
import { PlantContextProvider } from './contexts/PlantContext';
import { AsyncStatus, UserContextProvider } from './contexts/UserContext';
import SearchPage from './components/pages/SearchPage';
import GlobalStyles from './style/GlobalStyles';
import CommRouter from './CommRouter';
import useAuthHandler from './utils/useAuthHandler';
import LoadingPage from './components/loading/LoadingPage';

export type ParamTypes = {
    plant: string;
    project: string;
};

function App() {
    const authStatus = useAuthHandler();
    if (authStatus === AsyncStatus.LOADING)
        return <LoadingPage loadingText={'Signing in . . .'} />;
    if (authStatus === AsyncStatus.ERROR)
        return <LoadingPage loadingText={'Redirecting to login . . .'} />;
    return (
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
    );
}

export default App;
