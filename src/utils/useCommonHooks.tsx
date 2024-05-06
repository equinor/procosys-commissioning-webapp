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
  const { api, auth, appConfig, completionApi } = useContext(CommAppContext);
  const params = useParams<CommParams>();
  const { pathname } = useLocation();
  const history = useHistory();
  const { url, path } = useRouteMatch();
  return {
    api,
    completionApi,
    auth,
    params,
    history,
    url,
    path,
    pathname,
    appConfig
  };
};

export default useCommonHooks;
