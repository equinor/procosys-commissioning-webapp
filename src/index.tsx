import * as MSAL from "@azure/msal-browser";
import isPropValid from "@emotion/is-prop-valid";
import React from "react";
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

const ENV = import.meta.env;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const render = (content: JSX.Element): void => {
  root.render(
    <React.StrictMode>
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        <GlobalStyles />
        {content}
      </StyleSheetManager>
    </React.StrictMode>
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const initialize = async () => {
  // Get auth config, setup auth client and handle login
  const { clientSettings, scopes } = await getAuthConfig();
  const authClient = new MSAL.PublicClientApplication(clientSettings);
  await authClient.initialize();
  const authInstance = authService({
    MSAL: authClient,
    scopes: scopes
  });
  const isRedirecting = await authInstance.handleLogin();
  if (isRedirecting) return Promise.reject("redirecting");

  const { appConfig, featureFlags } = await getAppConfig();
  const baseApiInstance = baseApiService({
    authInstance,
    baseURL: ENV.VITE_BASE_URL_MAIN,
    scope: [ENV.VITE_WEBAPI_SCOPE]
  });
  const completionBaseApiInstance = baseApiService({
    authInstance,
    baseURL: ENV.VITE_BASE_URL_COMP,
    scope: [ENV.VITE_COMP_SCOPE]
  });
  const procosysApiInstance = procosysApiService({
    axios: baseApiInstance,
    apiVersion: ENV.VITE_API_VERSION
  });
  const completionApiInstance = completionApiService({
    axios: completionBaseApiInstance
  });
  const { appInsightsInstance, appInsightsReactPlugin } = initializeAppInsights(
    ENV.VITE_APP_INSIGHTS
  );
  return {
    authInstance,
    procosysApiInstance,
    completionApiInstance,
    completionBaseApiInstance,
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
      completionBaseApiInstance,
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
        completionBaseApiInstance={completionBaseApiInstance}
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
// Force test build
