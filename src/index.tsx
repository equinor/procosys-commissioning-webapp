import * as MSAL from "@azure/msal-browser";
import isPropValid from "@emotion/is-prop-valid";
import ReactDOM from "react-dom/client";
import { StyleSheetManager } from "styled-components";
import App from "./App";
import ErrorPage from "./components/error/ErrorPage";
import LoadingPage from "./components/loading/LoadingPage";
import { getAppConfig, getAuthConfig } from "./services/appConfiguration";
import initializeAppInsights from "./services/appInsights";
import authService from "./services/authService";
import baseApiService from "./services/baseApi";
import completionApiService from "./services/completionApi";
import procosysApiService from "./services/procosysApi";
import GlobalStyles from "./style/GlobalStyles";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const render = (content: JSX.Element): void => {
  root.render(
    // <React.StrictMode>
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <GlobalStyles />
      {content}
    </StyleSheetManager>
    // </React.StrictMode>
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const initialize = async () => {
  // Get auth config, setup auth client and handle login
  const { clientSettings, scopes, configurationScope, configurationEndpoint } =
    await getAuthConfig();
  const authClient = new MSAL.PublicClientApplication(clientSettings);
  await authClient.initialize();
  const authInstance = authService({
    MSAL: authClient,
    scopes: scopes
  });
  const isRedirecting = await authInstance.handleLogin();
  if (isRedirecting) return Promise.reject("redirecting");

  // Get config from App Configuration
  const configurationAccessToken = await authInstance.getAccessToken(
    configurationScope
  );

  const { appConfig, featureFlags } = await getAppConfig(
    configurationEndpoint,
    configurationAccessToken
  );
  const baseApiInstance = baseApiService({
    authInstance,
    baseURL: "https://pcs-main-api-dev-pr.azurewebsites.net/api",
    scope: appConfig.procosysWebApi.scope
  });
  const completionBaseApiInstance = baseApiService({
    authInstance,
    baseURL: "https://backend-procosys-completion-api-dev.radix.equinor.com",
    scope: ["api://e8c158a9-a200-4897-9d5f-660e377bddc1/ReadWrite"]
  });
  const procosysApiInstance = procosysApiService({
    axios: baseApiInstance,
    apiVersion: appConfig.procosysWebApi.apiVersion
  });
  const completionApiInstance = completionApiService({
    axios: completionBaseApiInstance
  });
  const { appInsightsInstance, appInsightsReactPlugin } = initializeAppInsights(
    appConfig.appInsights.instrumentationKey
  );
  return {
    authInstance,
    procosysApiInstance,
    completionApiInstance,
    appInsightsInstance,
    appInsightsReactPlugin,
    appConfig,
    featureFlags
  };
};

(async (): Promise<void> => {
  render(<LoadingPage loadingText={"Initializing..."} />);
  try {
    const {
      authInstance,
      procosysApiInstance,
      completionApiInstance,
      appInsightsInstance,
      appInsightsReactPlugin,
      appConfig,
      featureFlags
    } = await initialize();
    render(
      <App
        authInstance={authInstance}
        procosysApiInstance={procosysApiInstance}
        completionApiInstance={completionApiInstance}
        appInsightsInstance={appInsightsInstance}
        appInsightsReactPlugin={appInsightsReactPlugin}
        appConfig={appConfig}
        featureFlags={featureFlags}
      />
    );
  } catch (error) {
    if (error === "redirecting") {
      render(<LoadingPage loadingText={"Redirecting to login..."} />);
    } else {
      render(
        <ErrorPage
          title="Unable to initialize app"
          description="Check your connection or reload this page and try again. If problem persists, contact customer support"
        />
      );
    }
  }
})();

// This implements the default behavior from styled-components v5
export function shouldForwardProp(propName: string, target: any) {
  if (typeof target === "string") {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName);
  }
  // For other elements, forward all props
  return true;
}
// Force build and deploy v1
