import {
  BackButton,
  Document,
  FooterButton,
  Navbar,
  NavigationFooter,
  Scope,
  isArrayOfType,
  removeSubdirectories
} from "@equinor/procosys-webapp-components";
import Axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import EdsIcon from "../../components/icons/EdsIcon";
import { AsyncStatus } from "../../contexts/CommAppContext";
import withAccessControl from "../../services/withAccessControl";
import { COLORS } from "../../style/GlobalStyles";
import {
  ChecklistPreview,
  PunchPreview,
  TaskPreview
} from "../../typings/apiTypes";
import useCommonHooks from "../../utils/useCommonHooks";
import { SearchType } from "../Search/Search";
import Documents from "./Documents/Documents";
import EntityPageDetailsCard from "./EntityPageDetailsCard";
import PunchList from "./PunchList/PunchList";
import Tasks from "./Tasks/Tasks";

const ContentWrapper = styled.div`
  padding-bottom: 66px;
`;

const CommPkg = (): JSX.Element => {
  const { api, params, path, url, history } = useCommonHooks();
  const [scope, setScope] = useState<ChecklistPreview[]>();
  const [tasks, setTasks] = useState<TaskPreview[]>();
  const [punchList, setPunchList] = useState<PunchPreview[]>();
  const [documents, setDocuments] = useState<Document[]>();
  const [fetchFooterDataStatus, setFetchFooterDataStatus] = useState(
    AsyncStatus.LOADING
  );
  const [fetchScopeStatus, setFetchScopeStatus] = useState(AsyncStatus.LOADING);
  const [fetchPunchListStatus, setFetchPunchListStatus] = useState(
    AsyncStatus.LOADING
  );
  const [fetchDocumentsStatus, setFetchDocumentsStatus] = useState<AsyncStatus>(
    AsyncStatus.LOADING
  );
  const [fetchTasksStatus, setFetchTasksStatus] = useState<AsyncStatus>(
    AsyncStatus.LOADING
  );
  const source = Axios.CancelToken.source();
  const isOnScopePage =
    !history.location.pathname.includes("/punch-list") &&
    !history.location.pathname.includes("/documents") &&
    !history.location.pathname.includes("/tasks");

  const getTasksAndDocuments = useCallback(async () => {
    if (params.searchType != SearchType.Comm) return;
    const tasksFromApi = await api
      .getTasks(params.plant, params.entityId, source.token)
      .catch(() => setFetchFooterDataStatus(AsyncStatus.ERROR));
    if (isArrayOfType<TaskPreview>(tasksFromApi, "id")) {
      setTasks(tasksFromApi);
      if (tasksFromApi.length) {
        setFetchTasksStatus(AsyncStatus.SUCCESS);
      } else {
        setFetchTasksStatus(AsyncStatus.EMPTY_RESPONSE);
      }
    }
    const documents = await api
      .getDocuments(params.plant, params.entityId, source.token)
      .catch(() => setFetchFooterDataStatus(AsyncStatus.ERROR));
    if (isArrayOfType<Document>(documents, "documentId")) {
      setDocuments(documents);
      if (!documents.length) {
        setFetchDocumentsStatus(AsyncStatus.EMPTY_RESPONSE);
      } else {
        setFetchDocumentsStatus(AsyncStatus.SUCCESS);
      }
    }
  }, [params.plant, params.searchType, params.entityId]);

  const getScopeAndPunchList = useCallback(async () => {
    const scopeFromApi = await api
      .getScope(params.plant, params.searchType, params.entityId, source.token)
      .catch(() => {
        setFetchFooterDataStatus(AsyncStatus.ERROR);
      });
    const punchListFromApi = await api
      .getPunchList(
        params.plant,
        params.searchType,
        params.entityId,
        source.token
      )
      .catch(() => setFetchFooterDataStatus(AsyncStatus.ERROR));
    if (isArrayOfType<ChecklistPreview>(scopeFromApi, "id")) {
      setScope(scopeFromApi);
      if (scopeFromApi.length > 0) {
        setFetchScopeStatus(AsyncStatus.SUCCESS);
      } else {
        setFetchScopeStatus(AsyncStatus.EMPTY_RESPONSE);
      }
    }
    if (isArrayOfType<PunchPreview>(punchListFromApi, "id")) {
      setPunchList(punchListFromApi);
      if (punchListFromApi.length > 0) {
        setFetchPunchListStatus(AsyncStatus.SUCCESS);
      } else {
        setFetchPunchListStatus(AsyncStatus.EMPTY_RESPONSE);
      }
    }
    if (fetchFooterDataStatus != AsyncStatus.ERROR) {
      setFetchFooterDataStatus(AsyncStatus.SUCCESS);
    }
  }, [params.plant, params.searchType, params.entityId]);

  useEffect(() => {
    getScopeAndPunchList();
    getTasksAndDocuments();
    return (): void => {
      source.cancel();
    };
  }, [params.plant, params.entityId, params.searchType]);

  return (
    <main>
      <Navbar
        testColor
        noBorder
        leftContent={<BackButton to={removeSubdirectories(url, 2)} />}
        midContent={
          params.searchType === SearchType.Comm
            ? "Comm Package"
            : params.searchType
        }
      />
      <EntityPageDetailsCard />
      <ContentWrapper>
        <Switch>
          <Route
            exact
            path={`${path}`}
            render={(): JSX.Element => (
              <Scope
                fetchScopeStatus={fetchScopeStatus}
                onChecklistClick={(checklistId: number | string): void => {
                  const checkListGuid = scope?.find(
                    (s) => s.id === parseInt(`${checklistId}`)
                  )?.proCoSysGuid;
                  history.push(
                    `${history.location.pathname}/checklist/${checklistId}?checkListGuid=${checkListGuid}`
                  );
                }}
                scope={scope}
                hideFilter={params.searchType === SearchType.Comm}
              />
            )}
          />
          <Route
            exact
            path={`${path}/tasks`}
            render={(): JSX.Element => (
              <Tasks fetchStatus={fetchTasksStatus} tasks={tasks} />
            )}
          />
          <Route
            exact
            path={`${path}/punch-list`}
            render={(): JSX.Element => (
              <PunchList
                fetchPunchListStatus={fetchPunchListStatus}
                punchList={punchList}
              />
            )}
          />
          <Route
            exact
            path={`${path}/documents`}
            render={(): JSX.Element => (
              <Documents
                fetchDocumentsStatus={fetchDocumentsStatus}
                documents={documents}
              />
            )}
          />
        </Switch>
      </ContentWrapper>
      <NavigationFooter footerStatus={fetchFooterDataStatus}>
        <FooterButton
          active={isOnScopePage}
          goTo={(): void => history.push(url)}
          icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
          label="Scope"
          numberOfItems={scope?.length}
        />
        {history.location.pathname.includes("/Comm") ? (
          <>
            <FooterButton
              active={history.location.pathname.includes("/documents")}
              goTo={(): void => history.push(`${url}/documents`)}
              icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
              label="Documents"
            />
            <FooterButton
              active={history.location.pathname.includes("/tasks")}
              goTo={(): void => history.push(`${url}/tasks`)}
              icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
              label="Tasks"
              numberOfItems={tasks?.length}
            />
          </>
        ) : (
          <></>
        )}
        <FooterButton
          active={history.location.pathname.includes("/punch-list")}
          goTo={(): void =>
            history.push(`${url}/punch-list?tagId=${punchList?.at(0)?.tagId}`)
          }
          icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
          label="Punch list"
          numberOfItems={punchList?.length}
        />
      </NavigationFooter>
    </main>
  );
};

export default withAccessControl(CommPkg, [
  "COMMPKG/READ",
  "CPCL/READ",
  "RUNNING_LOGS/READ",
  "DOCUMENT/READ",
  "PUNCHLISTITEM/READ"
]);
