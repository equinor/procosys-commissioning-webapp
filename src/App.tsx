import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CommAppContextProvider } from './contexts/CommAppContext';
import GeneralRouter from './GeneralRouter';
import ErrorBoundary from './components/error/ErrorBoundary';
import { IAuthService } from './services/authService';
import { ProcosysApiService } from './services/procosysApi';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import {
    AppInsightsContext,
    ReactPlugin,
} from '@microsoft/applicationinsights-react-js';
import { AppConfig, FeatureFlags } from './services/appConfiguration';
import { SearchType } from './pages/Search/Search';

export type CommParams = {
    plant: string;
    project: string;
    searchType: SearchType;
    commPkg: string;
    taskId: string;
    checklistId: string;
    punchItemId: string;
};

type AppProps = {
    authInstance: IAuthService;
    procosysApiInstance: ProcosysApiService;
    appInsightsInstance: ApplicationInsights;
    appInsightsReactPlugin: ReactPlugin;
    appConfig: AppConfig;
    featureFlags: FeatureFlags;
};

const App = ({
    procosysApiInstance,
    authInstance,
    appInsightsReactPlugin: reactPlugin,
    appConfig,
    featureFlags,
}: AppProps): JSX.Element => {
    return (
        <AppInsightsContext.Provider value={reactPlugin}>
            <ErrorBoundary appInsights={reactPlugin}>
                <CommAppContextProvider
                    api={procosysApiInstance}
                    auth={authInstance}
                    appConfig={appConfig}
                    featureFlags={featureFlags}
                >
                    <Router basename={'/comm'}>
                        <Switch>
                            <Route
                                path="/:plant?/:project?"
                                component={GeneralRouter}
                            />
                            <Route render={(): JSX.Element => <h1>404</h1>} />
                        </Switch>
                    </Router>
                </CommAppContextProvider>
            </ErrorBoundary>
        </AppInsightsContext.Provider>
    );
};

export default App;
