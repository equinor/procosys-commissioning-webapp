import {
  AppInsightsContext,
  ReactPlugin
} from "@microsoft/applicationinsights-react-js";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { AxiosInstance } from "axios";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import GeneralRouter from "./GeneralRouter";
import ErrorBoundary from "./components/error/ErrorBoundary";
import { CommAppContextProvider } from "./contexts/CommAppContext";
import { SearchType } from "./pages/Search/Search";
import { AppConfig, FeatureFlags } from "./services/appConfiguration";
import { IAuthService } from "./services/authService";
import { CompletionApiService } from "./services/completionApi";
import { ProcosysApiService } from "./services/procosysApi";

export type CommParams = {
  plant: string;
  project: string;
  searchType: SearchType;
  entityId: string;
  taskId: string;
  checklistId: string;
  punchItemId: string;
};

type AppProps = {
  authInstance: IAuthService;
  procosysApiInstance: ProcosysApiService;
  completionApiInstance: CompletionApiService;
  completionBaseApiInstance: AxiosInstance;
  appInsightsInstance: ApplicationInsights;
  appInsightsReactPlugin: ReactPlugin;
  appConfig: AppConfig;
  featureFlags: FeatureFlags;
};

const App = ({
  procosysApiInstance,
  completionApiInstance,
  completionBaseApiInstance,
  authInstance,
  appInsightsReactPlugin: reactPlugin,
  appConfig,
  featureFlags
}: AppProps): JSX.Element => {
  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      <ErrorBoundary appInsights={reactPlugin}>
        <CommAppContextProvider
          api={procosysApiInstance}
          completionApi={completionApiInstance}
          completionBaseApiInstance={completionBaseApiInstance}
          auth={authInstance}
          appConfig={appConfig}
          featureFlags={featureFlags}
        >
          <Router basename={"/comm"}>
            <Switch>
              <Route path="/:plant?/:project?" component={GeneralRouter} />
              <Route render={(): JSX.Element => <h1>404</h1>} />
            </Switch>
          </Router>
        </CommAppContextProvider>
      </ErrorBoundary>
    </AppInsightsContext.Provider>
  );
};

export default App;
