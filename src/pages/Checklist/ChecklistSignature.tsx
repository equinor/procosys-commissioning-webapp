import React, { useEffect, useState } from 'react';
import { ChecklistDetails } from '../../services/apiTypes';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
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
    margin: 48px 0;
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
};

const ChecklistSignature = ({
    details,
    setIsSigned,
    isSigned,
    allItemsCheckedOrNA,
    reloadChecklist,
}: ChecklistSignatureProps) => {
    const { api, params } = useCommonHooks();
    const [comment, setComment] = useState(details.comment);
    const [putCommentStatus, setPutCommentStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [signStatus, setSignStatus] = useState(AsyncStatus.INACTIVE);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');

    const putComment = async () => {
        setPutCommentStatus(AsyncStatus.LOADING);
        try {
            await api.putChecklistComment(
                params.plant,
                params.checklistId,
                comment
            );
            setPutCommentStatus(AsyncStatus.SUCCESS);
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
            setShowSnackbar(true);
            setSnackbarText(
                isSigned ? 'Unsign complete.' : 'Signing complete.'
            );
            reloadChecklist((reloadStatus) => !reloadStatus);
        } catch (error) {
            setSignStatus(AsyncStatus.ERROR);
            setShowSnackbar(true);
            setSnackbarText(error);
        }
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
            {!isSigned && !allItemsCheckedOrNA && (
                <AllMustBeSignedWarning variant="warning">
                    <Typography type="body_long">
                        All applicable items must be checked before signing
                    </Typography>
                </AllMustBeSignedWarning>
            )}
            <TextField
                id={'Comment field'}
                maxLength={500}
                variant={determineVariant(putCommentStatus)}
                disabled={isSigned || putCommentStatus === AsyncStatus.LOADING}
                multiline
                rows={5}
                label="Comment"
                helperIcon={determineHelperIcon(putCommentStatus)}
                helperText={determineHelperText(putCommentStatus)}
                value={comment}
                onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => setComment(e.target.value)}
                onBlur={putComment}
            />

            <Button
                onClick={handleSignClick}
                disabled={
                    signStatus === AsyncStatus.LOADING || !allItemsCheckedOrNA
                }
            >
                {determineSignButtonText(isSigned, signStatus)}
            </Button>
            {details.signedAt ? (
                <p>
                    Signed by {details.signedByFirstName}{' '}
                    {details.signedByLastName} at{' '}
                    {new Date(details.signedAt).toLocaleDateString('en-GB')}
                </p>
            ) : null}

            <p>
                Updated by {details.updatedByFirstName}{' '}
                {details.updatedByLastName} at{' '}
                {new Date(details.updatedAt).toLocaleDateString('en-GB')}
            </p>
            <Snackbar
                onClose={() => {
                    setShowSnackbar(false);
                    setSnackbarText('');
                }}
                open={showSnackbar}
            >
                {snackbarText}
            </Snackbar>
        </ChecklistSignatureWrapper>
    );
};

export default ChecklistSignature;
