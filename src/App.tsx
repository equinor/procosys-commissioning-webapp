import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AsyncStatus, UserContextProvider } from './contexts/UserContext';
import CommRouter from './CommRouter';
import useAuthHandler from './utils/useAuthHandler';
import LoadingPage from './components/loading/LoadingPage';
import ErrorBoundary from './components/error/ErrorBoundary';

export type CommParams = {
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
                <ErrorBoundary>
                    <Switch>
                        <Route
                            path="/:plant?/:project?"
                            component={CommRouter}
                        />
                        <Route render={() => <h1>404</h1>} />
                    </Switch>
                </ErrorBoundary>
            </Router>
        </UserContextProvider>
    );
}

export default App;

/* 
Alternativ 1: 
    Flytte plantcontext høyere opp
    A: Eksportere setstates som setter params i plantContext
    B: Lage hooks som setter current plant/project basert på useLocation pathen
Alternativ 3: Wrappe alle komponenter som trenger navbar i en layout-komponent med navbaren inni
Alternativ 4: Custom hook med context som maintainer state? */
