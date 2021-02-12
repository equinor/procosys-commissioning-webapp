import React, { ReactNode, useContext, useEffect, useState } from 'react';
import LoadingPage from '../components/loading/LoadingPage';
import { CommParams } from '../App';
import { useParams } from 'react-router-dom';
import {
    ChecklistPreview,
    CommPkg,
    PunchPreview,
    TaskPreview,
} from '../services/apiTypes';
import CommAppContext from './CommAppContext';

export type CommPkgContextProps = {
    details: CommPkg;
    scope: ChecklistPreview[];
    tasks: TaskPreview[];
    punchList: PunchPreview[];
};

const CommPkgContext = React.createContext({} as CommPkgContextProps);

export const CommPkgContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { api } = useContext(CommAppContext);
    const [details, setDetails] = useState<CommPkg>();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [tasks, setTasks] = useState<TaskPreview[]>();
    const [punchList, setPunchList] = useState<PunchPreview[]>();

    const {
        plant: plantInURL,
        project: projectInURL,
        commPkg: commPkgInURL,
    } = useParams<CommParams>();

    useEffect(() => {
        (async () => {
            const detailsFromAPI = await api.getCommPackageDetails(
                `PCS$${plantInURL}`,
                commPkgInURL,
                projectInURL
            );
            setDetails(detailsFromAPI);
        })();
    }, [commPkgInURL, plantInURL, projectInURL]);

    useEffect(() => {
        if (!details) return;
        (async () => {
            const [
                scopeFromAPI,
                tasksFromAPI,
                punchListFromAPI,
            ] = await Promise.all([
                api.getScope(plantInURL, details.id),
                api.getTasks(plantInURL, details.id),
                api.getPunchList(plantInURL, details.id),
            ]);
            setScope(scopeFromAPI);
            setTasks(tasksFromAPI);
            setPunchList(punchListFromAPI);
        })();
    }, [plantInURL, details, api]);

    if (!details || !scope || !tasks || !punchList)
        return <LoadingPage loadingText={'Loading commissioning package'} />;

    return (
        <CommPkgContext.Provider
            value={{
                details,
                scope,
                punchList,
                tasks,
            }}
        >
            {children}
        </CommPkgContext.Provider>
    );
};

export default CommPkgContext;
