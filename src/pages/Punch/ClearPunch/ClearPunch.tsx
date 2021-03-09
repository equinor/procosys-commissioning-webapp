import { Button, NativeSelect, TextField } from '@equinor/eds-core-react';
import React from 'react';
import ErrorPage from '../../../components/error/ErrorPage';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import Navbar from '../../../components/navigation/Navbar';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import { ensure, removeSubdirectories } from '../../../utils/general';
import PunchDetailsCard from './PunchDetailsCard';
import { NewPunchFormWrapper } from '../NewPunch/NewPunchForm';
import useClearPunchFacade, {
    UpdatePunchEndpoint,
} from './useClearPunchFacade';
import styled from 'styled-components';
import ProcosysCard from '../../../components/ProcosysCard';
import Attachment, {
    AttachmentsWrapper,
    UploadImageButton,
} from '../../../components/Attachment';
import useCommonHooks from '../../../utils/useCommonHooks';
import UploadAttachment from '../../../components/UploadAttachment';
import EdsIcon from '../../../components/icons/EdsIcon';
import useAttachments from '../../../utils/useAttachments';
import buildEndpoint from '../../../utils/buildEndpoint';

export const PunchWrapper = styled.main``;

const ClearPunch = () => {
    const {
        updatePunchStatus,
        fetchPunchItemStatus,
        punchItem,
        clearPunchStatus,
        categories,
        types,
        organizations,
        url,
        snackbar,
        setSnackbarText,
        updateDatabase,
        clearPunchItem,
        handleCategoryChange,
        handleDescriptionChange,
        handleTypeChange,
        handleRaisedByChange,
        handleClearingByChange,
    } = useClearPunchFacade();
    const { api, params } = useCommonHooks();
    const {
        attachments,
        fetchAttachmentsStatus,
        showUploadModal,
        refreshAttachments,
        setShowUploadModal,
    } = useAttachments(
        buildEndpoint().getPunchAttachments(params.plant, params.punchItemId)
    );

    let descriptionBeforeEntering = '';

    const content = () => {
        if (fetchPunchItemStatus === AsyncStatus.SUCCESS && punchItem) {
            return (
                <>
                    <PunchDetailsCard
                        systemModule={punchItem.systemModule}
                        tagDescription={punchItem.tagDescription}
                    />
                    <NewPunchFormWrapper onSubmit={clearPunchItem}>
                        <NativeSelect
                            required
                            id="PunchCategorySelect"
                            label="Punch category"
                            disabled={clearPunchStatus === AsyncStatus.LOADING}
                            defaultValue={
                                ensure(
                                    categories.find(
                                        (category) =>
                                            category.code === punchItem.status
                                    )
                                ).id
                            }
                            onChange={handleCategoryChange}
                        >
                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >{`${category.description}`}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect
                            required
                            id="PunchTypeSelect"
                            label="Type"
                            disabled={clearPunchStatus === AsyncStatus.LOADING}
                            defaultValue={
                                ensure(
                                    types.find(
                                        (type) =>
                                            type.code === punchItem.typeCode
                                    )
                                ).id
                            }
                            onChange={handleTypeChange}
                        >
                            {types.map((type) => (
                                <option
                                    key={type.id}
                                    value={type.id}
                                >{`${type.code}. ${type.description}`}</option>
                            ))}
                        </NativeSelect>
                        <TextField
                            required
                            maxLength={255}
                            value={punchItem.description}
                            label="Description"
                            multiline
                            rows={5}
                            id="NewPunchDescription"
                            disabled={clearPunchStatus === AsyncStatus.LOADING}
                            onFocus={() =>
                                (descriptionBeforeEntering =
                                    punchItem.description)
                            }
                            onBlur={() => {
                                if (
                                    punchItem.description !==
                                    descriptionBeforeEntering
                                ) {
                                    updateDatabase(
                                        UpdatePunchEndpoint.Description,
                                        {
                                            Description: punchItem.description,
                                        }
                                    );
                                }
                            }}
                            onChange={handleDescriptionChange}
                        />
                        <NativeSelect
                            required
                            label="Raised by"
                            id="RaisedBySelect"
                            disabled={clearPunchStatus === AsyncStatus.LOADING}
                            defaultValue={
                                ensure(
                                    organizations.find(
                                        (org) =>
                                            org.code === punchItem.raisedByCode
                                    )
                                ).id
                            }
                            onChange={handleRaisedByChange}
                        >
                            {organizations.map((organization) => (
                                <option
                                    key={organization.id}
                                    value={organization.id}
                                >
                                    {organization.description}
                                </option>
                            ))}
                        </NativeSelect>
                        <NativeSelect
                            required
                            id="ClearingBySelect"
                            label="Clearing by"
                            disabled={clearPunchStatus === AsyncStatus.LOADING}
                            defaultValue={
                                ensure(
                                    organizations.find(
                                        (org) =>
                                            org.code ===
                                            punchItem.clearingByCode
                                    )
                                ).id
                            }
                            onChange={handleClearingByChange}
                        >
                            {organizations.map((organization) => (
                                <option
                                    key={organization.id}
                                    value={organization.id}
                                >
                                    {organization.description}
                                </option>
                            ))}
                        </NativeSelect>
                        <ProcosysCard
                            errorMessage="Unable to load attachments."
                            cardTitle="Attachments"
                            fetchStatus={fetchAttachmentsStatus}
                        >
                            <AttachmentsWrapper>
                                <UploadImageButton
                                    onClick={() => setShowUploadModal(true)}
                                >
                                    <EdsIcon name="camera_add_photo" />
                                </UploadImageButton>
                                {showUploadModal ? (
                                    <UploadAttachment
                                        setShowModal={setShowUploadModal}
                                        postAttachment={api.postPunchAttachment}
                                        refreshAttachments={refreshAttachments}
                                        parentId={params.punchItemId}
                                        setSnackbarText={setSnackbarText}
                                    />
                                ) : null}

                                {attachments.map((attachment) => (
                                    <Attachment
                                        key={attachment.id}
                                        getAttachment={api.getPunchAttachment}
                                        deleteAttachment={
                                            api.deletePunchAttachment
                                        }
                                        setSnackbarText={setSnackbarText}
                                        attachment={attachment}
                                        refreshAttachments={refreshAttachments}
                                        parentId={params.punchItemId}
                                    />
                                ))}
                            </AttachmentsWrapper>
                        </ProcosysCard>
                        <Button
                            type="submit"
                            disabled={
                                updatePunchStatus === AsyncStatus.LOADING ||
                                clearPunchStatus === AsyncStatus.LOADING
                            }
                        >
                            Clear
                        </Button>
                    </NewPunchFormWrapper>
                </>
            );
        } else if (fetchPunchItemStatus === AsyncStatus.ERROR) {
            return (
                <ErrorPage
                    title="Unable to fetch punch item"
                    description="Please check your connection, reload this page or try again later."
                />
            );
        } else {
            return <SkeletonLoadingPage text="Loading punch item" />;
        }
    };

    return (
        <>
            <Navbar
                noBorder
                leftContent={{
                    name: 'back',
                    label: 'Punch list',
                    url: removeSubdirectories(url, 2),
                }}
            />
            <PunchWrapper>{content()}</PunchWrapper>
            {snackbar}
        </>
    );
};

export default ClearPunch;
