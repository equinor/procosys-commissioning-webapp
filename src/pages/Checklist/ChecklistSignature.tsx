import React, { useEffect, useState } from 'react';
import { ChecklistDetails } from '../../typings/apiTypes';
import { Button, TextField } from '@equinor/eds-core-react';
import styled from 'styled-components';
import { AsyncStatus } from '../../contexts/CommAppContext';
import {
    determineHelperText,
    determineVariant,
} from '../../utils/textFieldHelpers';
import useCommonHooks from '../../utils/useCommonHooks';

const ChecklistSignatureWrapper = styled.div<{ helperTextVisible: boolean }>`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
`;

const ButtonWrapper = styled.div`
    display: flex;
    margin-bottom: 12px;
    justify-content: flex-end;
    & button,
    button:disabled {
        margin-left: 12px;
    }
`;

const determineSignButtonText = (
    isSigned: boolean,
    status: AsyncStatus
): string => {
    if (status === AsyncStatus.LOADING) {
        if (isSigned) return 'Unsigning...';
        return 'Signing...';
    } else {
        if (isSigned) return 'Unsign';
        return 'Sign';
    }
};

const determineVerifyButtonText = (
    isVerified: boolean,
    status: AsyncStatus
): string => {
    if (status === AsyncStatus.LOADING) {
        if (isVerified) return 'Unverifying...';
        return 'Verifying...';
    } else {
        if (isVerified) return 'Unverify';
        return 'Verify';
    }
};

type ChecklistSignatureProps = {
    details: ChecklistDetails;
    setIsSigned: React.Dispatch<React.SetStateAction<boolean>>;
    isSigned: boolean;
    canSign: boolean;
    setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
    isVerified: boolean;
    canVerify: boolean;
    allItemsCheckedOrNA: boolean;
    reloadChecklist: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const ChecklistSignature = ({
    details,
    setIsSigned,
    isSigned,
    canSign,
    setIsVerified,
    isVerified,
    canVerify,
    allItemsCheckedOrNA,
    reloadChecklist,
    setSnackbarText,
}: ChecklistSignatureProps): JSX.Element => {
    const { api, params } = useCommonHooks();
    const [comment, setComment] = useState(details.comment);
    const [putCommentStatus, setPutCommentStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [signStatus, setSignStatus] = useState(AsyncStatus.INACTIVE);
    const [verifyStatus, setVerifyStatus] = useState(AsyncStatus.INACTIVE);
    let commentBeforeFocus = '';
    const putComment = async (): Promise<void> => {
        if (comment === commentBeforeFocus) return;
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
    const handleSignClick = async (): Promise<void> => {
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
            if (!(error instanceof Error)) return;
            setSignStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    const handleVerifyClick = async (): Promise<void> => {
        setVerifyStatus(AsyncStatus.LOADING);
        try {
            if (isVerified) {
                await api.postUnverify(params.plant, params.checklistId);
                setIsVerified(false);
            } else {
                await api.postVerify(params.plant, params.checklistId);
                setIsVerified(true);
            }
            setVerifyStatus(AsyncStatus.SUCCESS);
            setSnackbarText(
                isVerified ? 'Unverify complete.' : 'Verifying complete.'
            );
            reloadChecklist((reloadStatus) => !reloadStatus);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setVerifyStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    const updatedByText = (): string => {
        return `Updated by ${details.updatedByFirstName} ${
            details.updatedByLastName
        } at ${new Date(details.updatedAt).toLocaleDateString('en-GB')}`;
    };
    useEffect(() => {
        if (
            putCommentStatus === AsyncStatus.INACTIVE ||
            putCommentStatus === AsyncStatus.LOADING
        )
            return;
        setTimeout(() => {
            setPutCommentStatus(AsyncStatus.INACTIVE);
        }, 2000);
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
            <p>
                {details.verifiedAt ? (
                    <>
                        Verified by {details.verifiedByFirstName}{' '}
                        {details.verifiedByLastName} at{' '}
                        {new Date(details.verifiedAt).toLocaleDateString(
                            'en-GB'
                        )}
                    </>
                ) : null}
            </p>
            <TextField
                id={'comment-field'}
                maxLength={500}
                variant={determineVariant(putCommentStatus)}
                disabled={isSigned || putCommentStatus === AsyncStatus.LOADING}
                multiline
                rows={5}
                label="Comment"
                helperText={
                    putCommentStatus === AsyncStatus.INACTIVE &&
                    details.updatedAt
                        ? updatedByText()
                        : determineHelperText(putCommentStatus)
                }
                value={comment}
                onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ): void => setComment(e.target.value)}
                onFocus={(): string => (commentBeforeFocus = comment)}
                onBlur={putComment}
            />
            <ButtonWrapper>
                {isVerified ? null : (
                    <Button
                        variant={isSigned ? 'outlined' : 'contained'}
                        onClick={handleSignClick}
                        disabled={
                            !canSign ||
                            signStatus === AsyncStatus.LOADING ||
                            verifyStatus === AsyncStatus.LOADING ||
                            !allItemsCheckedOrNA
                        }
                    >
                        {determineSignButtonText(isSigned, signStatus)}
                    </Button>
                )}

                {isSigned ? (
                    <Button
                        variant={isVerified ? 'outlined' : 'contained'}
                        onClick={handleVerifyClick}
                        disabled={
                            !canVerify ||
                            verifyStatus === AsyncStatus.LOADING ||
                            signStatus === AsyncStatus.LOADING
                        }
                    >
                        {determineVerifyButtonText(isVerified, verifyStatus)}
                    </Button>
                ) : null}
            </ButtonWrapper>
        </ChecklistSignatureWrapper>
    );
};
export default ChecklistSignature;
