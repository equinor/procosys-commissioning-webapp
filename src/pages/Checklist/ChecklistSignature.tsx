import React, { useEffect, useState } from 'react';
import { ChecklistDetails } from '../../services/apiTypes';
import {
    Button,
    Divider,
    TextField,
    Typography,
} from '@equinor/eds-core-react';
import styled from 'styled-components';
import { AsyncStatus } from '../../contexts/CommAppContext';
import {
    determineHelperIcon,
    determineHelperText,
    determineVariant,
} from '../../utils/textFieldHelpers';
import { Card, Snackbar } from '@equinor/eds-core-react';
import useCommonHooks from '../../utils/useCommonHooks';

const AllMustBeSignedWarning = styled(Card)`
    margin-bottom: 16px;
`;

const ChecklistSignatureWrapper = styled.div<{ helperTextVisible: boolean }>`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    & button,
    button:disabled {
        width: fit-content;
        margin-left: auto;
        margin-top: ${(props) => (props.helperTextVisible ? '0' : '24px')};
    }
`;

const determineSignButtonText = (isSigned: boolean, status: AsyncStatus) => {
    if (status === AsyncStatus.LOADING) {
        if (isSigned) return 'Unsigning...';
        return 'Signing...';
    } else {
        if (isSigned) return 'Unsign';
        return 'Sign';
    }
};

type ChecklistSignatureProps = {
    details: ChecklistDetails;
    setIsSigned: React.Dispatch<React.SetStateAction<boolean>>;
    isSigned: boolean;
    allItemsCheckedOrNA: boolean;
    reloadChecklist: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const ChecklistSignature = ({
    details,
    setIsSigned,
    isSigned,
    allItemsCheckedOrNA,
    reloadChecklist,
    setSnackbarText,
}: ChecklistSignatureProps) => {
    const { api, params } = useCommonHooks();
    const [comment, setComment] = useState(details.comment);
    const [putCommentStatus, setPutCommentStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [signStatus, setSignStatus] = useState(AsyncStatus.INACTIVE);

    const putComment = async () => {
        setPutCommentStatus(AsyncStatus.LOADING);
        try {
            await api.putChecklistComment(
                params.plant,
                params.checklistId,
                comment
            );
            setPutCommentStatus(AsyncStatus.SUCCESS);
            reloadChecklist((prev) => !prev);
        } catch (error) {
            setPutCommentStatus(AsyncStatus.ERROR);
        }
    };

    const handleSignClick = async () => {
        setSignStatus(AsyncStatus.LOADING);
        try {
            if (isSigned) {
                await api.postUnsign(params.plant, params.checklistId);
                setIsSigned(false);
            } else {
                await api.postSign(params.plant, params.checklistId);
                setIsSigned(true);
            }
            setSignStatus(AsyncStatus.SUCCESS);
            setSnackbarText(
                isSigned ? 'Unsign complete.' : 'Signing complete.'
            );
            reloadChecklist((reloadStatus) => !reloadStatus);
        } catch (error) {
            setSignStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    const updatedByText = () => {
        return `Updated by ${details.updatedByFirstName} ${
            details.updatedByLastName
        } at ${new Date(details.updatedAt).toLocaleDateString('en-GB')}`;
    };

    useEffect(() => {
        if (putCommentStatus !== AsyncStatus.SUCCESS) return;
        setTimeout(() => {
            setPutCommentStatus(AsyncStatus.INACTIVE);
        }, 3000);
    }, [putCommentStatus]);

    return (
        <ChecklistSignatureWrapper
            helperTextVisible={putCommentStatus !== AsyncStatus.INACTIVE}
        >
            <p>
                {details.signedAt ? (
                    <>
                        Signed by {details.signedByFirstName}{' '}
                        {details.signedByLastName} at{' '}
                        {new Date(details.signedAt).toLocaleDateString('en-GB')}
                    </>
                ) : (
                    'This checklist is unsigned.'
                )}
            </p>
            <Divider />

            <TextField
                id={'Comment field'}
                maxLength={500}
                variant={determineVariant(putCommentStatus)}
                disabled={isSigned || putCommentStatus === AsyncStatus.LOADING}
                multiline
                rows={5}
                label="Comment"
                helperIcon={determineHelperIcon(putCommentStatus)}
                helperText={
                    putCommentStatus === AsyncStatus.INACTIVE &&
                    details.updatedAt
                        ? updatedByText()
                        : determineHelperText(putCommentStatus)
                }
                value={comment}
                onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => setComment(e.target.value)}
                onBlur={putComment}
            />
            {!isSigned && !allItemsCheckedOrNA && (
                <AllMustBeSignedWarning variant="warning">
                    <Typography type="body_long">
                        All applicable items must be checked before signing
                    </Typography>
                </AllMustBeSignedWarning>
            )}
            <Button
                onClick={handleSignClick}
                disabled={
                    signStatus === AsyncStatus.LOADING || !allItemsCheckedOrNA
                }
            >
                {determineSignButtonText(isSigned, signStatus)}
            </Button>
        </ChecklistSignatureWrapper>
    );
};

export default ChecklistSignature;
