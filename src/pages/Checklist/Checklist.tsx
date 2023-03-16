import React, { useContext, useEffect, useState } from 'react';
import { AsyncStatus } from '../../contexts/CommAppContext';
import {
    CheckItem,
    ChecklistDetails,
    CustomCheckItem,
} from '../../typings/apiTypes';
import CheckItems from './CheckItems/CheckItems';
import ChecklistSignature from './ChecklistSignature';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import axios from 'axios';
import useCommonHooks from '../../utils/useCommonHooks';
import AsyncCard from '../../components/AsyncCard';
import { CardWrapper } from '../../components/EdsCard';
import useSnackbar from '../../utils/useSnackbar';
import AsyncPage from '../../components/AsyncPage';
import { Banner } from '@equinor/eds-core-react';
import { Attachment, Attachments } from '@equinor/procosys-webapp-components';
import PlantContext from '../../contexts/PlantContext';
import CustomCheckItems from './CheckItems/CustomCheckItems';
import CheckAllButton from './CheckItems/CheckAllButton';

const ChecklistWrapper = styled.div`
    padding: 0 4%;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 55px);
    & > ${CardWrapper}:first-of-type {
        margin-top: 50px;
    }
`;

const AttachmentsHeader = styled.h5`
    margin-top: 54px;
    margin-bottom: 0px;
`;

const AttachmentsWrapper = styled.div`
    padding: 16px 0;
`;

export const BottomSpacer = styled.div`
    height: 70px;
`;

const determineIfAllAreCheckedOrNA = (
    checkItemsToDetermine: CheckItem[],
    customCheckItemsToDetermine: CustomCheckItem[]
): boolean => {
    return (
        checkItemsToDetermine.every(
            (item) => item.isOk || item.isNotApplicable
        ) &&
        customCheckItemsToDetermine.every((item) => item.isOk) &&
        !checkItemsToDetermine.every((item) => item.isNotApplicable)
    );
};

const ChecklistPage = (): JSX.Element => {
    const { permissions } = useContext(PlantContext);
    const { params, api } = useCommonHooks();
    const { snackbar, setSnackbarText } = useSnackbar();
    const [fetchChecklistStatus, setFetchChecklistStatus] = useState(
        AsyncStatus.LOADING
    );
    const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
    const [checklistDetails, setChecklistDetails] =
        useState<ChecklistDetails>();
    const [customCheckItems, setCustomCheckItems] = useState<CustomCheckItem[]>(
        []
    );

    const [isSigned, setIsSigned] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [allItemsCheckedOrNA, setAllItemsCheckedOrNA] = useState(true);
    const [reloadChecklist, setReloadChecklist] = useState(false);
    const source = axios.CancelToken.source();

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const checklistResponse = await api.getChecklist(
                    params.plant,
                    params.checklistId,
                    source.token
                );
                setIsSigned(!!checklistResponse.checkList.signedByFirstName);
                setIsVerified(
                    !!checklistResponse.checkList.verifiedByFirstName
                );
                setCheckItems(checklistResponse.checkItems);
                setCustomCheckItems(checklistResponse.customCheckItems);
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

    useEffect(() => {
        setAllItemsCheckedOrNA(
            determineIfAllAreCheckedOrNA(checkItems, customCheckItems)
        );
    }, [checkItems, customCheckItems]);

    return (
        <AsyncPage
            fetchStatus={fetchChecklistStatus}
            errorMessage={
                'Unable to load checklist. Please reload or try again later.'
            }
            loadingMessage={'Loading checklist'}
        >
            <>
                {isSigned && !isVerified && (
                    <Banner>
                        <Banner.Icon variant={'info'}>
                            <EdsIcon name={'info_circle'} />
                        </Banner.Icon>
                        <Banner.Message>
                            This checklist is signed. Unsign to make changes.
                        </Banner.Message>
                    </Banner>
                )}
                {isVerified && (
                    <Banner>
                        <Banner.Icon variant={'info'}>
                            <EdsIcon name={'info_circle'} />
                        </Banner.Icon>
                        <Banner.Message>
                            This checklist is verified.
                        </Banner.Message>
                    </Banner>
                )}
                {checklistDetails && (
                    <ChecklistWrapper>
                        {!isSigned && (
                            <CheckAllButton
                                setSnackbarText={setSnackbarText}
                                allItemsCheckedOrNA={allItemsCheckedOrNA}
                                checkItems={checkItems}
                                customCheckItems={customCheckItems}
                                setCheckItems={setCheckItems}
                                setCustomCheckItems={setCustomCheckItems}
                            />
                        )}

                        <CheckItems
                            setCheckItems={setCheckItems}
                            checkItems={checkItems}
                            details={checklistDetails}
                            isSigned={isSigned}
                            setSnackbarText={setSnackbarText}
                        />
                        <CustomCheckItems
                            plantId={params.plant}
                            checklistId={params.checklistId}
                            customCheckItems={customCheckItems}
                            setCustomCheckItems={setCustomCheckItems}
                            isSigned={isSigned}
                            setSnackbarText={setSnackbarText}
                            api={api}
                            canEdit={permissions.includes('CPCL/WRITE')}
                            canCheck={permissions.includes('CPCL/SIGN')}
                        />

                        <AttachmentsHeader>Attachments</AttachmentsHeader>
                        <AttachmentsWrapper>
                            <Attachments
                                getAttachments={(): Promise<Attachment[]> =>
                                    api.getChecklistAttachments(
                                        params.plant,
                                        params.checklistId
                                    )
                                }
                                getAttachment={(
                                    attachmentId: number
                                ): Promise<Blob> =>
                                    api.getChecklistAttachment(
                                        source.token,
                                        params.plant,
                                        params.checklistId,
                                        attachmentId
                                    )
                                }
                                postAttachment={(
                                    file: FormData,
                                    title: string
                                ): Promise<void> =>
                                    api.postChecklistAttachment(
                                        params.plant,
                                        parseInt(params.checklistId),
                                        file,
                                        title
                                    )
                                }
                                deleteAttachment={(
                                    attachmentId: number
                                ): Promise<void> =>
                                    api.deleteChecklistAttachment(
                                        source.token,
                                        params.plant,
                                        params.checklistId,
                                        attachmentId
                                    )
                                }
                                setSnackbarText={setSnackbarText}
                                readOnly={isSigned}
                            />
                        </AttachmentsWrapper>

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
                                isVerified={isVerified}
                                canSign={permissions.includes('CPCL/SIGN')}
                                canVerify={permissions.includes('CPCL/VERIFY')}
                                details={checklistDetails}
                                setIsSigned={setIsSigned}
                                setIsVerified={setIsVerified}
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
                )}
                {snackbar}
                <BottomSpacer />
            </>
        </AsyncPage>
    );
};

export default ChecklistPage;
