import { useContext } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { CommParams } from '../App';
import CommAppContext from '../contexts/CommAppContext';

const useCommonHooks = () => {
    const { api, auth } = useContext(CommAppContext);
    const params = useParams<CommParams>();
    const history = useHistory();
    const { url, path } = useRouteMatch();
    return {
        api,
        auth,
        params,
        history,
        url,
        path,
    };
};

export default useCommonHooks;
