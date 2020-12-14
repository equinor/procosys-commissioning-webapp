import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AsyncStatus, UserContextProvider } from './contexts/UserContext';
import GeneralRouter from './GeneralRouter';
import useAuthHandler from './services/useAuthHandler';
import LoadingPage from './components/loading/LoadingPage';
import ErrorBoundary from './components/error/ErrorBoundary';

export type CommParams = {
    plant: string;
    project: string;
    commPkg: string;
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
                <ErrorBoundary>
                    <Switch>
                        <Route
                            path="/:plant?/:project?"
                            component={GeneralRouter}
                        />
                        <Route render={() => <h1>404</h1>} />
                    </Switch>
                </ErrorBoundary>
            </Router>
        </UserContextProvider>
    );
}

export default App;
