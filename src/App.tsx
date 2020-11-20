import React from 'react';
import Navbar from './components/navigation/Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AsyncStatus, UserContextProvider } from './contexts/UserContext';
import CommRouter from './CommRouter';
import useAuthHandler from './utils/useAuthHandler';
import LoadingPage from './components/loading/LoadingPage';
import ErrorBoundary from './components/error/ErrorBoundary';
import SelectPlant from './pages/SelectPlant';

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
                <ErrorBoundary>
                    <Switch>
                        <Route exact path={'/'} component={SelectPlant} />
                        <Route path="/:plant" component={CommRouter} />
                        <Route render={() => <h1>404</h1>} />
                    </Switch>
                </ErrorBoundary>
            </Router>
        </UserContextProvider>
    );
}

export default App;
