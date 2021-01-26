import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AsyncStatus, UserContextProvider } from './contexts/UserContext';
import GeneralRouter from './GeneralRouter';
import LoadingPage from './components/loading/LoadingPage';
import ErrorBoundary from './components/error/ErrorBoundary';

export type CommParams = {
    plant: string;
    project: string;
    commPkg: string;
    checklistId: string;
    task: string;
    punch: string;
};

type AppProps = {
    authInstance: any;
};

const App = ({ authInstance }: AppProps) => {
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
};

export default App;
