import React, { useEffect, useState } from 'react';
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
import AsyncPage from '../../components/AsyncPage';
import { Banner, Button } from '@equinor/eds-core-react';
import {
    BackButton,
    Navbar,
    removeSubdirectories,
} from '@equinor/procosys-webapp-components';

const ChecklistWrapper = styled.div`
    padding: 0 4%;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 55px);
    & > ${CardWrapper}:first-of-type {
        margin-top: 50px;
    }
`;

const Checklist = (): JSX.Element => {
    const { params, api, history, url } = useCommonHooks();
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
        AsyncStatus.LOADING
    );
    const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
    const [
        checklistDetails,
        setChecklistDetails,
    ] = useState<ChecklistDetails>();
    const [isSigned, setIsSigned] = useState(false);
    const [allItemsCheckedOrNA, setAllItemsCheckedOrNA] = useState(true);
    const [reloadChecklist, setReloadChecklist] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const source = axios.CancelToken.source();

    useEffect(() => {
        (async (): Promise<void> => {
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
        return (): void => {
            source.cancel('Checklist component unmounted');
        };
    }, [params.checklistId, params.plant, reloadChecklist, api]);

    const content = (): JSX.Element => {
        if (!checklistDetails) return <></>;
        return (
            <>
                <ChecklistDetailsCard
                    details={checklistDetails}
                    isSigned={isSigned}
                    descriptionLabel={'checklist'}
                />
                {isSigned && (
                    <Banner>
                        <Banner.Icon variant={'info'}>
                            <EdsIcon name={'info_circle'} />
                        </Banner.Icon>
                        <Banner.Message>
                            This checklist is signed. Unsign to make changes.
                        </Banner.Message>
                    </Banner>
                )}
                <ChecklistWrapper>
                    <CheckItems
                        setAllItemsCheckedOrNA={setAllItemsCheckedOrNA}
                        allItemsCheckedOrNA={allItemsCheckedOrNA}
                        checkItems={checkItems}
                        details={checklistDetails}
                        isSigned={isSigned}
                        setSnackbarText={setSnackbarText}
                    />
                    <AsyncCard
                        errorMessage={
                            'Unable to load attachments for this checklist.'
                        }
                        cardTitle={'Attachments'}
                        fetchStatus={fetchAttachmentsStatus}
                    >
                        <AttachmentsWrapper>
                            <UploadImageButton
                                disabled={isSigned}
                                onClick={(): void => setShowUploadModal(true)}
                            >
                                <EdsIcon name="camera_add_photo" />
                            </UploadImageButton>
                            {showUploadModal ? (
                                <UploadAttachment
                                    setShowModal={setShowUploadModal}
                                    setSnackbarText={setSnackbarText}
                                    updateAttachments={setRefreshAttachments}
                                    postAttachment={api.postChecklistAttachment}
                                    parentId={params.checklistId}
                                />
                            ) : null}
                            {attachments.map((attachment) => (
                                <Attachment
                                    key={attachment.id}
                                    isSigned={isSigned}
                                    getAttachment={(
                                        cancelToken: CancelToken
                                    ): Promise<Blob> =>
                                        api.getChecklistAttachment(
                                            cancelToken,
                                            params.plant,
                                            params.checklistId,
                                            attachment.id
                                        )
                                    }
                                    setSnackbarText={setSnackbarText}
                                    attachment={attachment}
                                    refreshAttachments={setRefreshAttachments}
                                    deleteAttachment={(
                                        cancelToken: CancelToken
                                    ): Promise<void> =>
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
                    {!isSigned && !allItemsCheckedOrNA && (
                        <Banner>
                            <Banner.Icon variant={'warning'}>
                                <EdsIcon name={'warning_outlined'} />
                            </Banner.Icon>
                            <Banner.Message>
                                All applicable items must be checked before
                                signing.
                            </Banner.Message>
                        </Banner>
                    )}
                </ChecklistWrapper>
            </>
        );
    };

    return (
        <>
            <Navbar
                leftContent={
                    <BackButton
                        to={
                            history.location.pathname.includes('/new-punch')
                                ? `${removeSubdirectories(
                                      history.location.pathname,
                                      1
                                  )}`
                                : `${removeSubdirectories(url, 2)}`
                        }
                    />
                }
                midContent={'MCCR'}
                rightContent={
                    history.location.pathname.includes(
                        '/new-punch'
                    ) ? undefined : (
                        <Button
                            variant="ghost"
                            onClick={(): void =>
                                history.push(`${url}/punch-list/new-punch`)
                            }
                        >
                            New punch
                        </Button>
                    )
                }
            />
            <AsyncPage
                fetchStatus={fetchChecklistStatus}
                errorMessage={
                    'Unable to load checklist. Please reload or try again later.'
                }
                loadingMessage={'Loading checklist'}
            >
                {content()}
            </AsyncPage>
            {snackbar}
        </>
    );
};

export default Checklist;
