/* eslint-disable @typescript-eslint/explicit-function-return-type */

const ENV = import.meta.env;

export type AuthSettings = {
  clientId: string;
  authority: string;
  scopes: string[];
};

export type FeatureFlags = {
  commAppIsEnabled: boolean;
};

export type AppConfig = {
  ocrFunctionEndpoint: string;
};

export const getAuthConfig = async () => {
  const clientSettings = {
    auth: {
      clientId: ENV.VITE_AUTH_CLIENT,
      authority: ENV.VITE_AUTHORITY,
      redirectUri: window.location.origin + "/comm"
    }
  };
  const scopes = ["User.Read"];
  return {
    clientSettings,
    scopes
  };
};

export const getAppConfig = async () => {
  const appConfig: AppConfig = {
    ocrFunctionEndpoint: ENV.VITE_OCR_ENDPOINT
  };
  const featureFlags: FeatureFlags = { commAppIsEnabled: true };
  return { appConfig, featureFlags };
};
