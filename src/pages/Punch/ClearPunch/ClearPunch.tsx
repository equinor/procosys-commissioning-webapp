import { Button, NativeSelect, TextField } from '@equinor/eds-core-react';
import React from 'react';
import ErrorPage from '../../../components/error/ErrorPage';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import Navbar from '../../../components/navigation/Navbar';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import { ensure, removeLastSubdirectory } from '../../../utils/general';
import PunchDetailsCard from './PunchDetailsCard';
import { NewPunchFormWrapper } from '../NewPunch/NewPunchForm';
import useClearPunchFacade, {
    UpdatePunchEndpoint,
} from './useClearPunchFacade';

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
        updateDatabase,
        clearPunchItem,
        handleCategoryChange,
        handleDescriptionChange,
        handleTypeChange,
        handleRaisedByChange,
        handleClearingByChange,
    } = useClearPunchFacade();
    let descriptionBeforeBlur = '';

    let content = <SkeletonLoadingPage text="Loading punch item" />;
    if (fetchPunchItemStatus === AsyncStatus.SUCCESS && punchItem) {
        content = (
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
                                    (type) => type.code === punchItem.typeCode
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
                            (descriptionBeforeBlur = punchItem.description)
                        }
                        onBlur={() => {
                            if (
                                punchItem.description !== descriptionBeforeBlur
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
                                    (org) => org.code === punchItem.raisedByCode
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
                                        org.code === punchItem.clearingByCode
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
                    <Button
                        type="submit"
                        disabled={updatePunchStatus === AsyncStatus.LOADING}
                    >
                        Clear
                    </Button>
                </NewPunchFormWrapper>
            </>
        );
    }
    if (fetchPunchItemStatus === AsyncStatus.ERROR) {
        content = (
            <ErrorPage
                title="Unable to fetch punch item"
                description="Please check your connection, reload this page or try again later."
            />
        );
    }
    console.log(removeLastSubdirectory(removeLastSubdirectory(url)));
    return (
        <>
            <Navbar
                noBorder
                leftContent={{
                    name: 'back',
                    label: 'Punch list',
                    url: removeLastSubdirectory(removeLastSubdirectory(url)),
                }}
            />
            {content}
        </>
    );
};

export default ClearPunch;
