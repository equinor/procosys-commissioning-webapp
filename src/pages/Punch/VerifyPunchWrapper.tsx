import {
  AsyncStatus,
  PunchAction,
  VerifyPunch,
  removeSubdirectories,
  useSnackbar
} from "@equinor/procosys-webapp-components";
import axios from "axios";
import { Dispatch, useState } from "react";
import { Attachment, PunchItem } from "../../typings/apiTypes";
import useCommonHooks from "../../utils/useCommonHooks";

type VerifyPunchProps = {
  punchItem: PunchItem;
  canUnclear: boolean;
  canVerify: boolean;
  setRowVersion: Dispatch<React.SetStateAction<string | undefined>>;
};

const VerifyPunchWrapper = ({
  punchItem,
  canUnclear,
  canVerify,
  setRowVersion
}: VerifyPunchProps): JSX.Element => {
  const { url, history, params, api, completionApi } = useCommonHooks();
  const [punchActionStatus, setPunchActionStatus] = useState(
    AsyncStatus.INACTIVE
  );
  const { snackbar, setSnackbarText } = useSnackbar();
  const source = axios.CancelToken.source();

  const handlePunchAction = async (
    punchAction: PunchAction,
    newUrl: string
  ): Promise<void> => {
    setPunchActionStatus(AsyncStatus.LOADING);
    try {
      const rowVersion = await completionApi.postPunchAction(
        params.plant,
        params.punchItemId,
        punchAction,
        punchItem.rowVersion
      );
      setRowVersion(rowVersion);

      setPunchActionStatus(AsyncStatus.SUCCESS);
      history.push(newUrl);
    } catch (error) {
      setPunchActionStatus(AsyncStatus.ERROR);
      setSnackbarText(`Couldn't handle ${punchAction}`);
    }
  };

  return (
    <VerifyPunch
      plantId={params.plant}
      punchItem={punchItem as any}
      canUnclear={canUnclear}
      canVerify={canVerify}
      handleUnclear={(): Promise<void> =>
        handlePunchAction(PunchAction.UNCLEAR, url)
      }
      handleUnverify={(): Promise<void> =>
        handlePunchAction(PunchAction.UNVERIFY, url)
      }
      handleReject={(): Promise<void> =>
        handlePunchAction(
          PunchAction.REJECT,
          removeSubdirectories(url, 2) + "/punch-list"
        )
      }
      handleVerify={(): Promise<void> =>
        handlePunchAction(
          PunchAction.VERIFY,
          removeSubdirectories(url, 2) + "/punch-list"
        )
      }
      punchActionStatus={punchActionStatus}
      getPunchAttachments={(
        plantId: string,
        guid: string
      ): Promise<Attachment[]> => {
        return completionApi.getPunchAttachments(plantId, guid);
      }}
      getPunchAttachment={(
        plantId: string,
        punchGuid: string,
        attachmentGuid: string
      ): Promise<Blob> => {
        return completionApi.getPunchAttachment(
          source.token,
          plantId,
          punchGuid,
          attachmentGuid
        );
      }}
      getPunchComments={completionApi.getPunchComments}
      snackbar={snackbar}
      setSnackbarText={setSnackbarText}
    />
  );
};

export default VerifyPunchWrapper;
