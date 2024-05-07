import { Typography } from "@equinor/eds-core-react";
import {
  PunchList as TagPunchList,
  removeSubdirectories
} from "@equinor/procosys-webapp-components";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AsyncPage from "../../../components/AsyncPage";
import CompletionStatusIcon from "../../../components/icons/CompletionStatusIcon";
import { AsyncStatus } from "../../../contexts/CommAppContext";
import { PunchPreview } from "../../../typings/apiTypes";
import useCommonHooks from "../../../utils/useCommonHooks";
import { SearchType } from "../../Search/Search";

const InfoRow = styled.div`
  &:first-child {
    margin-right: 20px;
  }
`;

const ModuleAndTagWrapper = styled.div`
  display: flex;
`;

const PreviewButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: 8px 0;
  margin: 10px 4% 0 4%;
  cursor: pointer;
  text-decoration: none;
  justify-content: space-between;
  & > img {
    max-height: 20px;
    object-fit: contain;
    flex: 0.1;
  }
  & > div {
    margin-left: 24px;
    flex: 3;
    & p {
      margin: 0;
    }
  }
  & > svg {
    flex: 0.5;
  }
`;

type PunchListProps = {
  fetchPunchListStatus: AsyncStatus;
  punchList?: PunchPreview[];
};

const PunchList = ({
  fetchPunchListStatus,
  punchList
}: PunchListProps): JSX.Element => {
  const { url, params, history } = useCommonHooks();

  if (params.searchType === SearchType.Tag) {
    return (
      <TagPunchList
        fetchPunchListStatus={fetchPunchListStatus}
        onPunchClick={(punch: PunchPreview): void =>
          history.push(
            `${removeSubdirectories(url)}/punch-item/${punch.proCoSysGuid}`
          )
        }
        punchList={punchList}
      />
    );
  } else {
    return (
      <AsyncPage
        fetchStatus={fetchPunchListStatus}
        errorMessage={"Error: Unable to get punch list. Please try again."}
        emptyContentMessage={"The punch list is empty."}
      >
        <>
          {punchList?.map((punch) => (
            <PreviewButton
              to={`${removeSubdirectories(url)}/punch-item/${
                punch.proCoSysGuid
              }`}
              key={punch.id}
            >
              <CompletionStatusIcon status={punch.status} />
              <div>
                <Typography variant="body_short" lines={2}>
                  {punch.cleared ? "Cleared: " : null}
                  {punch.description}
                </Typography>
                <ModuleAndTagWrapper>
                  <InfoRow>
                    <label>Module: </label>
                    <p>{punch.systemModule}</p>
                  </InfoRow>
                  <InfoRow>
                    <label>Tag: </label>
                    <Typography variant="body_short" lines={1}>
                      {punch.tagDescription}
                    </Typography>
                  </InfoRow>
                </ModuleAndTagWrapper>
              </div>
            </PreviewButton>
          ))}
        </>
      </AsyncPage>
    );
  }
};

export default PunchList;
