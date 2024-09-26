import { useContext } from "react";
import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch
} from "react-router-dom";
import { CommParams } from "../App";
import CommAppContext from "../contexts/CommAppContext";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useCommonHooks = () => {
  const { api, auth, appConfig, completionApi, completionBaseApiInstance } =
    useContext(CommAppContext);
  const params = useParams<CommParams>();
  const { pathname } = useLocation();
  const history = useHistory();
  const { url, path } = useRouteMatch();
  const useTestColorIfOnTest = window.location.hostname.includes(
    "frontend-procosys-commissioning-webapp-test"
  );
  return {
    api,
    completionApi,
    completionBaseApiInstance,
    auth,
    params,
    history,
    url,
    path,
    pathname,
    appConfig,
    useTestColorIfOnTest
  };
};

export default useCommonHooks;
