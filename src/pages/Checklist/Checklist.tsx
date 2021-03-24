import React, { useEffect, useState } from 'react';
import ErrorPage from '../../components/error/ErrorPage';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import Navbar from '../../components/navigation/Navbar';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { CheckItem, ChecklistDetails } from '../../services/apiTypes';
import CheckItems from './CheckItems/CheckItems';
import ChecklistSignature from './ChecklistSignature';
import ChecklistDetailsCard from './ChecklistDetailsCard';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import axios, { CancelToken } from 'axios';
import useCommonHooks from '../../utils/useCommonHooks';
import AsyncCard from '../../components/AsyncCard';
import Attachment, {
    AttachmentsWrapper,
    UploadImageButton,
} from '../../components/Attachment';
import UploadAttachment from '../../components/UploadAttachment';
import { CardWrapper } from '../../components/EdsCard';
import useAttachments from '../../utils/useAttachments';
import buildEndpoint from '../../utils/buildEndpoint';
import useSnackbar from '../../utils/useSnackbar';
import { COLORS } from '../../style/GlobalStyles';

const ChecklistWrapper = styled.div`
    padding: 0 4%;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 55px);
    & > ${CardWrapper}:first-of-type {
        margin-top: 50px;
    }
`;

export const IsSignedBanner = styled.div`
    background-color: ${COLORS.white};
    padding: 12px 4%;
    display: flex;
    align-items: center;
    & p {
        margin: 0 0 0 12px;
    }
    & svg {
        flex: 24px 0 0;
    }
`;

const Checklist = () => {
    const { params, api } = useCommonHooks();
    const getAttachmentsEndpoint = buildEndpoint().getChecklistAttachments(
        params.plant,
        params.checklistId
    );
    const {
        refreshAttachments: setRefreshAttachments,
        attachments,
        fetchAttachmentsStatus,
    } = useAttachments(getAttachmentsEndpoint);
    const { snackbar, setSnackbarText } = useSnackbar();
    const [fetchChecklistStatus, setFetchChecklistStatus] = useState(
        AsyncStatus.SUCCESS
    );
    const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
    const [checklistDetails, setChecklistDetails] = useState<
        ChecklistDetails
    >();
    const [isSigned, setIsSigned] = useState(false);
    const [allItemsCheckedOrNA, setAllItemsCheckedOrNA] = useState(true);
    const [reloadChecklist, setReloadChecklist] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    useEffect(() => {
        const source = axios.CancelToken.source();
        (async () => {
            try {
                const checklistResponse = await api.getChecklist(
                    params.plant,
                    params.checklistId
                );
                setIsSigned(!!checklistResponse.checkList.signedByFirstName);
                setCheckItems(checklistResponse.checkItems);
                setChecklistDetails(checklistResponse.checkList);
                setFetchChecklistStatus(AsyncStatus.SUCCESS);
            } catch (err) {
                setFetchChecklistStatus(AsyncStatus.ERROR);
            }
        })();
        return () => {
            source.cancel('Checklist component unmounted');
        };
    }, [params.checklistId, params.plant, reloadChecklist, api]);

    const content = () => {
        if (
            fetchChecklistStatus === AsyncStatus.SUCCESS &&
            checkItems &&
            checklistDetails
        ) {
            return (
                <>
                    <ChecklistDetailsCard
                        details={checklistDetails}
                        isSigned={isSigned}
                        descriptionLabel={'checklist'}
                    />
                    {isSigned && (
                        <IsSignedBanner>
                            <EdsIcon name="info_circle" />
                            <p>Unsign to make changes.</p>
                        </IsSignedBanner>
                    )}
                    <ChecklistWrapper>
                        <CheckItems
                            setAllItemsCheckedOrNA={setAllItemsCheckedOrNA}
                            allItemsCheckedOrNA={allItemsCheckedOrNA}
                            checkItems={checkItems}
                            details={checklistDetails}
                            isSigned={isSigned}
                        />
                        <AsyncCard
                            errorMessage={
                                'Unable to load attachments for this checklist.'
                            }
                            emptyContentMessage={
                                'This checklist has no attachments'
                            }
                            cardTitle={'Attachments'}
                            fetchStatus={fetchAttachmentsStatus}
                        >
                            <AttachmentsWrapper>
                                <UploadImageButton
                                    disabled={isSigned}
                                    onClick={() => setShowUploadModal(true)}
                                >
                                    <EdsIcon name="camera_add_photo" />
                                </UploadImageButton>
                                {showUploadModal ? (
                                    <UploadAttachment
                                        setShowModal={setShowUploadModal}
                                        setSnackbarText={setSnackbarText}
                                        refreshAttachments={
                                            setRefreshAttachments
                                        }
                                        postAttachment={
                                            api.postChecklistAttachment
                                        }
                                        parentId={params.checklistId}
                                    />
                                ) : null}
                                {attachments.map((attachment) => (
                                    <Attachment
                                        key={attachment.id}
                                        isSigned={isSigned}
                                        getAttachment={(
                                            cancelToken: CancelToken
                                        ) =>
                                            api.getChecklistAttachment(
                                                cancelToken,
                                                params.plant,
                                                params.checklistId,
                                                attachment.id
                                            )
                                        }
                                        setSnackbarText={setSnackbarText}
                                        attachment={attachment}
                                        refreshAttachments={
                                            setRefreshAttachments
                                        }
                                        deleteAttachment={(
                                            cancelToken: CancelToken
                                        ) =>
                                            api.deleteChecklistAttachment(
                                                cancelToken,
                                                params.plant,
                                                params.checklistId,
                                                attachment.id
                                            )
                                        }
                                    />
                                ))}
                            </AttachmentsWrapper>
                        </AsyncCard>
                        <AsyncCard
                            fetchStatus={fetchChecklistStatus}
                            errorMessage={'Unable to load checklist signature.'}
                            cardTitle={'Signature'}
                        >
                            <ChecklistSignature
                                setSnackbarText={setSnackbarText}
                                reloadChecklist={setReloadChecklist}
                                allItemsCheckedOrNA={allItemsCheckedOrNA}
                                isSigned={isSigned}
                                details={checklistDetails}
                                setIsSigned={setIsSigned}
                            />
                        </AsyncCard>
                    </ChecklistWrapper>
                </>
            );
        } else if (fetchChecklistStatus === AsyncStatus.ERROR) {
            return (
                <ErrorPage
                    title="Could not load checklist"
                    description="Please reload this page or try again later"
                />
            );
        } else {
            return (
                <ChecklistWrapper>
                    <SkeletonLoadingPage text="Loading checklist" />
                </ChecklistWrapper>
            );
        }
    };

    return (
        <>
            <Navbar
                noBorder={true}
                leftContent={{ name: 'back', label: 'CommPkg' }}
                rightContent={{ name: 'newPunch' }}
            />
            {content()}
            {snackbar}
        </>
    );
};

export default Checklist;
