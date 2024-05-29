/* eslint-disable @typescript-eslint/explicit-function-return-type */
import axios from "axios";

const ENV = import.meta.env;

export type AuthSettings = {
  clientId: string;
  authority: string;
  scopes: string[];
};

type ProcosysApiSettings = {
  baseUrl: string;
  apiVersion: string;
  scope: string[];
};

type AppInsightsConfig = {
  instrumentationKey: string;
};

type AuthConfigResponse = {
  clientId: string;
  authority: string;
  scopes: string[];
  configurationScope: string[];
  configurationEndpoint: string;
};

export type FeatureFlags = {
  commAppIsEnabled: boolean;
};

export type AppConfig = {
  procosysWebApi: ProcosysApiSettings;
  appInsights: AppInsightsConfig;
  ocrFunctionEndpoint: string;
};

type AppConfigResponse = {
  configuration: AppConfig;
  featureFlags: FeatureFlags;
};

export const getAuthConfig = async () => {
  // Todo: TypeGuard authsettings
  const clientSettings = {
    auth: {
      clientId: ENV.VITE_AUTH_CLIENT,
      authority: ENV.VITE_AUTHORITY,
      redirectUri: window.location.origin + "/comm"
    }
  };
  const scopes = ["User.Read"];
  const configurationScope = ENV.VITE_CONFIG_SCOPE;
  const configurationEndpoint = ENV.VITE_CONFIG_ENDPOINT;
  return {
    clientSettings,
    scopes,
    configurationScope,
    configurationEndpoint
  };
};

export const getAppConfig = async (endpoint: string, accessToken: string) => {
  const { data } = await axios.get<AppConfigResponse>(endpoint, {
    headers: {
      Authorization: "Bearer " + accessToken
    }
  });

  const appConfig: AppConfig = data.configuration;
  const featureFlags: FeatureFlags = data.featureFlags;
  return { appConfig, featureFlags };
};
