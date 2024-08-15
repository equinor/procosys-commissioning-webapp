import { DotProgress } from "@equinor/eds-core-react";
import {
  AsyncStatus,
  BackButton,
  CompletionStatus,
  FooterButton,
  InfoItem,
  Navbar,
  NavigationFooter,
  SkeletonLoadingPage,
  isOfType,
  removeSubdirectories
} from "@equinor/procosys-webapp-components";
import Axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import AsyncPage from "../../components/AsyncPage";
import TagInfoWrapper from "../../components/TagInfoWrapper";
import EdsIcon from "../../components/icons/EdsIcon";
import PlantContext from "../../contexts/PlantContext";
import withAccessControl from "../../services/withAccessControl";
import { COLORS } from "../../style/GlobalStyles";
import { PunchItem } from "../../typings/apiTypes";
import useCommonHooks from "../../utils/useCommonHooks";
import { DetailsWrapper } from "../EntityPage/EntityPageDetailsCard";
import ClearPunchWrapper from "./ClearPunchWrapper";
import VerifyPunchWrapper from "./VerifyPunchWrapper";

const PunchPage = (): JSX.Element => {
  const { params, path, history, url, completionApi } = useCommonHooks();
  const [punch, setPunch] = useState<PunchItem>();
  const [rowVersion, setRowVersion] = useState<string>();
  const [fetchPunchStatus, setFetchPunchStatus] = useState<AsyncStatus>(
    AsyncStatus.LOADING
  );
  const source = Axios.CancelToken.source();
  const { permissions } = useContext(PlantContext);

  const getPunchItem = useCallback(async () => {
    const punchFromApi = await completionApi
      .getPunchItem(params.plant, params.punchItemId)
      .catch(() => setFetchPunchStatus(AsyncStatus.ERROR));

    if (isOfType<PunchItem>(punchFromApi, "guid")) {
      setPunch(punchFromApi);
      setFetchPunchStatus(AsyncStatus.SUCCESS);
    }
  }, [params.plant, params.punchItemId]);

  useEffect(() => {
    getPunchItem();
    return (): void => {
      source.cancel();
    };
  }, [rowVersion]);

  const determineComponentToRender = (): JSX.Element => {
    if (punch === undefined) return <SkeletonLoadingPage />;
    if (punch.clearedAtUtc != null) {
      return (
        <VerifyPunchWrapper
          punchItem={punch}
          canUnclear={permissions.includes("PUNCHLISTITEM/CLEAR")}
          canVerify={permissions.includes("PUNCHLISTITEM/VERIFY")}
          setRowVersion={setRowVersion}
        />
      );
    } else {
      return (
        <ClearPunchWrapper
          punchItem={punch}
          setPunchItem={
            setPunch as React.Dispatch<React.SetStateAction<PunchItem>>
          }
          canEdit={permissions.includes("PUNCHLISTITEM/WRITE")}
          canClear={permissions.includes("PUNCHLISTITEM/CLEAR")}
          setRowVersion={setRowVersion}
        />
      );
    }
  };

  const determineDetailsCard = (): JSX.Element => {
    if (punch && fetchPunchStatus === AsyncStatus.SUCCESS) {
      return (
        <InfoItem
          isDetailsCard
          status={punch.category as CompletionStatus}
          statusLetters={[
            punch.clearedBy?.firstName ? "C" : null,
            punch.verifiedBy?.firstName ? "V" : null
          ]}
          headerText={punch.tagNo}
          description={punch.tagDescription}
          attachments={punch.attachmentCount}
          chips={[punch.itemNo.toString()]}
        />
      );
    } else if (fetchPunchStatus === AsyncStatus.LOADING) {
      return (
        <DetailsWrapper>
          <DotProgress color="primary" />
        </DetailsWrapper>
      );
    } else {
      return (
        <DetailsWrapper>Unable to load details. Please reload</DetailsWrapper>
      );
    }
  };

  return (
    <main>
      <Navbar
        testColor
        noBorder
        leftContent={
          <BackButton
            to={`${removeSubdirectories(url, 2)}/punch-list${location.search}`}
          />
        }
        midContent="Punch Item"
      />
      {determineDetailsCard()}
      <AsyncPage
        fetchStatus={fetchPunchStatus}
        errorMessage={"Unable to load punch item."}
      >
        <Switch>
          <Route
            exact
            path={`${path}/tag-info`}
            render={(): JSX.Element => (
              <TagInfoWrapper
                tagId={parseInt(location.search.split("tagId=")[1])}
              />
            )}
          />
          <Route exact path={`${path}`} render={determineComponentToRender} />
        </Switch>
      </AsyncPage>
      <NavigationFooter>
        <FooterButton
          active={!history.location.pathname.includes("/tag-info")}
          goTo={(): void => history.push(`${url}${location.search}`)}
          icon={<EdsIcon name="warning_filled" color={COLORS.mossGreen} />}
          label="Punch item"
        />
        <FooterButton
          active={history.location.pathname.includes("/tag-info")}
          goTo={(): void => history.push(`${url}/tag-info${location.search}`)}
          icon={<EdsIcon name="tag" />}
          label={"Tag info"}
        />
      </NavigationFooter>
    </main>
  );
};

export default withAccessControl(PunchPage, ["PUNCHLISTITEM/READ", "TAG/READ"]);
