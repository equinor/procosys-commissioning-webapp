import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CommAppContextProvider } from './contexts/CommAppContext';
import GeneralRouter from './GeneralRouter';
import ErrorBoundary from './components/error/ErrorBoundary';
import { IAuthService } from './services/authService';
import { ProcosysApiService } from './services/procosysApi';

export type CommParams = {
    plant: string;
    project: string;
    commPkg: string;
    checklistId: string;
    task: string;
    punch: string;
};

type AppProps = {
    authInstance: IAuthService;
    procosysApiInstance: ProcosysApiService;
};

const App = ({ procosysApiInstance, authInstance }: AppProps) => {
    return (
        <CommAppContextProvider api={procosysApiInstance} auth={authInstance}>
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
        </CommAppContextProvider>
    );
};

export default App;
