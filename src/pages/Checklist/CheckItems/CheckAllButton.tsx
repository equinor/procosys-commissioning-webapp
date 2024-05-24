import { Button } from "@equinor/eds-core-react";
import React, { useState } from "react";
import styled from "styled-components";
import EdsIcon from "../../../components/icons/EdsIcon";
import { AsyncStatus } from "../../../contexts/CommAppContext";
import { CheckItem, CustomCheckItem } from "../../../typings/apiTypes";
import useCommonHooks from "../../../utils/useCommonHooks";
import updateCheck from "./updateCheck";
import updateCustomCheck from "./updateCustomCheck";
import updateNA from "./updateNA";

const StyledCheckAllButton = styled(Button)`
  &:disabled {
    margin: 24px 0 12px auto;
  }
  margin: 24px 0 12px auto;
`;

type CheckAllButtonProps = {
  checkItems: CheckItem[];
  customCheckItems: CustomCheckItem[];
  setCheckItems: React.Dispatch<React.SetStateAction<CheckItem[]>>;
  setCustomCheckItems: React.Dispatch<React.SetStateAction<CustomCheckItem[]>>;
  allItemsCheckedOrNA: boolean;
  setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const CheckAllButton = ({
  checkItems,
  customCheckItems,
  setCheckItems,
  setCustomCheckItems,
  allItemsCheckedOrNA,
  setSnackbarText
}: CheckAllButtonProps): JSX.Element => {
  const { api, params } = useCommonHooks();
  const [checkAllStatus, setCheckAllStatus] = useState(AsyncStatus.INACTIVE);

  const checkAll = async (): Promise<void> => {
    setCheckAllStatus(AsyncStatus.LOADING);

    const itemsToCheck = checkItems.filter(
      (item) => !item.isOk && !item.isNotApplicable
    );

    const customItemsToCheck = customCheckItems.filter((item) => !item.isOk);

    try {
      await Promise.all(
        itemsToCheck.map((item) => {
          return api.postSetOk(params.plant, params.checklistId, item.id);
        })
      );
      await Promise.all(
        customItemsToCheck.map((item) => {
          return api.postCustomSetOk(params.plant, params.checklistId, item.id);
        })
      );
      itemsToCheck.forEach((item) => {
        updateCheck({
          value: true,
          checkItemId: item.id,
          setItems: setCheckItems
        });
      });
      customItemsToCheck.forEach((item) => {
        updateCustomCheck({
          value: true,
          checkItemId: item.id,
          setItems: setCustomCheckItems
        });
      });

      setCheckAllStatus(AsyncStatus.SUCCESS);
      setSnackbarText("Changes saved.");
    } catch (error) {
      setCheckAllStatus(AsyncStatus.ERROR);
      setSnackbarText("Unable to save changes.");
    }
  };

  const uncheckAll = async (): Promise<void> => {
    setCheckAllStatus(AsyncStatus.LOADING);
    const itemsToClear = checkItems.filter(
      (item) => item.isOk && !item.isNotApplicable
    );
    const customItemsToClear = customCheckItems.filter((item) => item.isOk);

    try {
      await Promise.all(
        itemsToClear.map((item) => {
          return api.postClear(params.plant, params.checklistId, item.id);
        })
      );

      await Promise.all(
        customItemsToClear.map((item) => {
          return api.postCustomClear(params.plant, params.checklistId, item.id);
        })
      );

      itemsToClear.forEach((item) => {
        updateCheck({
          value: false,
          checkItemId: item.id,
          setItems: setCheckItems
        });
        updateNA({
          value: false,
          checkItemId: item.id,
          setItems: setCheckItems
        });
      });

      customItemsToClear.forEach((item) =>
        updateCustomCheck({
          value: false,
          checkItemId: item.id,
          setItems: setCustomCheckItems
        })
      );

      setCheckAllStatus(AsyncStatus.SUCCESS);
      setSnackbarText("Uncheck complete.");
    } catch (error) {
      setCheckAllStatus(AsyncStatus.ERROR);
      setSnackbarText("Unable to save changes.");
    }
  };

  return (
    <StyledCheckAllButton
      variant="outlined"
      onClick={allItemsCheckedOrNA ? uncheckAll : checkAll}
      disabled={checkAllStatus === AsyncStatus.LOADING}
    >
      <EdsIcon name={allItemsCheckedOrNA ? "checkbox" : "checkbox_outline"} />
      {allItemsCheckedOrNA ? "Uncheck all" : "Check all"}
    </StyledCheckAllButton>
  );
};

export default CheckAllButton;
