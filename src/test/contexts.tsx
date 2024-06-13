import * as Msal from "@azure/msal-browser";
import { AxiosInstance } from "axios";
import { MemoryRouter } from "react-router-dom";
import CommAppContext, { AsyncStatus } from "../contexts/CommAppContext";
import PlantContext from "../contexts/PlantContext";
import authService from "../services/__mocks__/authService";
import { AppConfig, FeatureFlags } from "../services/appConfiguration";
import { IAuthService } from "../services/authService";
import baseApiService from "../services/baseApi";
import completionApiService, {
  CompletionApiService
} from "../services/completionApi";
import procosysApiService, {
  ProcosysApiService
} from "../services/procosysApi";
import { Plant, Project } from "../typings/apiTypes";
import { dummyPermissions, testPlants, testProjects } from "./dummyData";
import { baseURL } from "./setupServer";

const client = new Msal.PublicClientApplication({
  auth: { clientId: "testId", authority: "testAuthority" }
});

const authInstance = authService({ MSAL: client, scopes: ["testScope"] });
const baseApiInstance = baseApiService({
  authInstance,
  baseURL: baseURL,
  scope: ["testscope"]
});
const procosysApiInstance = procosysApiService({
  axios: baseApiInstance,
  apiVersion: "dummy-version"
});
const completionApiInstance = completionApiService({
  axios: baseApiInstance
});

const completionBaseApi: AxiosInstance = baseApiService({
  authInstance,
  baseURL: "https://backend-procosys-completion-api-dev.radix.equinor.com",
  scope: ["api://e8c158a9-a200-4897-9d5f-660e377bddc1/ReadWrite"]
});
const dummyAppConfig: AppConfig = {
  ocrFunctionEndpoint: "https://dummy-org-endpoint.com"
};
const dummyFeatureFlags: FeatureFlags = {
  commAppIsEnabled: true
};

type WithCommAppContextProps = {
  Component: JSX.Element;
  asyncStatus?: AsyncStatus;
  plants?: Plant[];
  auth?: IAuthService;
  api?: ProcosysApiService;
  completionApi?: CompletionApiService;
  completionBaseApiInstance?: AxiosInstance;
};

export const withCommAppContext = ({
  Component,
  asyncStatus = AsyncStatus.SUCCESS,
  plants = testPlants,
  auth = authInstance,
  api = procosysApiInstance,
  completionApi = completionApiInstance,
  completionBaseApiInstance = completionBaseApi
}: WithCommAppContextProps): JSX.Element => {
  return (
    <MemoryRouter initialEntries={["/test/sub/directory"]}>
      <CommAppContext.Provider
        value={{
          availablePlants: plants,
          fetchPlantsStatus: asyncStatus,
          auth,
          api,
          completionApi,
          completionBaseApiInstance,
          appConfig: dummyAppConfig,
          featureFlags: dummyFeatureFlags
        }}
      >
        {Component}
      </CommAppContext.Provider>
    </MemoryRouter>
  );
};

type WithPlantContextProps = {
  Component: JSX.Element;
  fetchProjectsAndPermissionsStatus?: AsyncStatus;
  permissions?: string[];
  currentPlant?: Plant | undefined;
  availableProjects?: Project[] | null;
  currentProject?: Project | undefined;
  setCurrentProject?: (project: Project) => void;
};

export const withPlantContext = ({
  fetchProjectsAndPermissionsStatus = AsyncStatus.SUCCESS,
  availableProjects = testProjects,
  currentPlant = testPlants[1],
  currentProject = testProjects[1],
  permissions = dummyPermissions,
  Component
}: WithPlantContextProps): JSX.Element => {
  return withCommAppContext({
    Component: (
      <PlantContext.Provider
        value={{
          fetchProjectsAndPermissionsStatus,
          permissions,
          currentPlant,
          availableProjects,
          currentProject
        }}
      >
        {Component}
      </PlantContext.Provider>
    )
  });
};
