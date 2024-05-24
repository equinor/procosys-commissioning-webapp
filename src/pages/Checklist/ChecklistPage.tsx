import { Button } from "@equinor/eds-core-react";
import {
  BackButton,
  FooterButton,
  Navbar,
  NavigationFooter,
  PunchList,
  isArrayOfType,
  isOfType,
  removeSubdirectories
} from "@equinor/procosys-webapp-components";
import Axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import TagInfoWrapper from "../../components/TagInfoWrapper";
import EdsIcon from "../../components/icons/EdsIcon";
import { AsyncStatus } from "../../contexts/CommAppContext";
import withAccessControl from "../../services/withAccessControl";
import { ChecklistResponse, PunchPreview } from "../../typings/apiTypes";
import useCommonHooks from "../../utils/useCommonHooks";
import ChecklistWrapper, { BottomSpacer } from "./Checklist";
import ChecklistDetailsCard from "./ChecklistDetailsCard";
import NewPunchWrapper from "./NewPunchWrapper";

const ChecklistPage = (): JSX.Element => {
  const { history, url, path, api, params } = useCommonHooks();
  const [punchList, setPunchList] = useState<PunchPreview[]>();
  const [details, setDetails] = useState<ChecklistResponse>();
  const [fetchPunchListStatus, setFetchPunchListStatus] = useState(
    AsyncStatus.LOADING
  );
  const [fetchDetailsStatus, setFetchDetailsStatus] = useState(
    AsyncStatus.LOADING
  );
  const source = Axios.CancelToken.source();
  const isOnNewPunchPage = history.location.pathname.includes("/new-punch");
  const isOnPunchListPage = history.location.pathname.includes("/punch-list");
  const isOnTagInfoPage = history.location.pathname.includes("/tag-info");
  const goBackToPunchListPage = `${removeSubdirectories(
    history.location.pathname
  )}${location.search}`;

  const goBackToEntityPage = removeSubdirectories(url, 2);

  useEffect(() => {
    getPunchList();
    getCheckList();
    return (): void => {
      source.cancel();
    };
  }, [history.location.pathname]);

  const getCheckList = useCallback(async () => {
    const detailsFromApi = await api
      .getChecklist(params.plant, params.checklistId, source.token)
      .catch(() => {
        setFetchDetailsStatus(AsyncStatus.ERROR);
      });

    if (detailsFromApi && isOfType(detailsFromApi, "checkList")) {
      setDetails(detailsFromApi);
      setFetchDetailsStatus(AsyncStatus.SUCCESS);
    }
  }, [api, params.checklistId, params.plant]);

  const getPunchList = useCallback(async () => {
    const punchListFromApi = await api
      .getChecklistPunchList(params.plant, params.checklistId, source.token)
      .catch(() => {
        setFetchPunchListStatus(AsyncStatus.ERROR);
      });
    if (isArrayOfType(punchListFromApi, "proCoSysGuid")) {
      setPunchList(punchListFromApi);
      if (punchListFromApi.length === 0) {
        setFetchPunchListStatus(AsyncStatus.EMPTY_RESPONSE);
      } else {
        setFetchPunchListStatus(AsyncStatus.SUCCESS);
      }
    }
  }, [api, params.checklistId, params.plant, history.location.pathname]);

  return (
    <main>
      <Navbar
        leftContent={
          <BackButton
            to={isOnNewPunchPage ? goBackToPunchListPage : goBackToEntityPage}
          />
        }
        midContent={"CPCL"}
        rightContent={
          history.location.pathname.includes("/new-punch") ? undefined : (
            <Button
              variant="ghost"
              onClick={(): void =>
                history.push(`${url}/punch-list/new-punch${location.search}`)
              }
            >
              New punch
            </Button>
          )
        }
      />
      <ChecklistDetailsCard
        fetchDetailsStatus={fetchDetailsStatus}
        details={details}
      />
      <Switch>
        <Route
          exact
          path={`${path}`}
          render={(): JSX.Element => <ChecklistWrapper />}
        />
        <Route
          exact
          path={`${path}/tag-info`}
          render={(): JSX.Element => (
            <TagInfoWrapper tagId={details?.checkList.tagId} />
          )}
        />
        <Route
          exact
          path={`${path}/punch-list`}
          render={(): JSX.Element => (
            <>
              <PunchList
                fetchPunchListStatus={fetchPunchListStatus}
                onPunchClick={(punch: PunchPreview): void =>
                  history.push(
                    `${removeSubdirectories(
                      history.location.pathname
                    )}/punch-item/${punch.proCoSysGuid}${
                      location.search
                    }&tagId=${details?.checkList.tagId}`
                  )
                }
                punchList={punchList}
                isChecklistPunchList
              />
              <BottomSpacer />
            </>
          )}
        />
        <Route
          exact
          path={`${path}/punch-list/new-punch`}
          component={NewPunchWrapper}
        />
      </Switch>
      <NavigationFooter footerStatus={fetchPunchListStatus}>
        <FooterButton
          active={!(isOnPunchListPage || isOnTagInfoPage)}
          goTo={(): void => history.push(`${url}${location.search}`)}
          icon={<EdsIcon name="playlist_added" />}
          label={"Checklist"}
        />
        <FooterButton
          active={isOnTagInfoPage}
          goTo={(): void => history.push(`${url}/tag-info${location.search}`)}
          icon={<EdsIcon name="tag" />}
          label={"Tag info"}
        />
        <FooterButton
          active={isOnPunchListPage}
          goTo={(): void => history.push(`${url}/punch-list${location.search}`)}
          icon={<EdsIcon name="warning_outlined" />}
          label={"Punch list"}
          numberOfItems={punchList?.length}
        />
      </NavigationFooter>
    </main>
  );
};

export default withAccessControl(ChecklistPage, [
  "CPCL/READ",
  "PUNCHLISTITEM/READ"
]);
