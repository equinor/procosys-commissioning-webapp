import React, { useState, useEffect, useContext, ReactElement } from 'react';
import ErrorPage from '../components/error/ErrorPage';
import SkeletonLoader from '../components/loading/SkeletonLoader';
import PlantContext from '../contexts/PlantContext';
import CommAppContext, { AsyncStatus } from '../contexts/CommAppContext';

const withAccessControl =
    (
        WrappedComponent: () => ReactElement,
        requiredPermissions: string[] = []
    ) =>
    (props: JSX.IntrinsicAttributes): JSX.Element => {
        const { permissions } = useContext(PlantContext);
        const { featureFlags } = useContext(CommAppContext);
        const [checkPermissionsStatus, setCheckPermissionsStatus] = useState(
            AsyncStatus.LOADING
        );
        useEffect(() => {
            if (permissions.length < 1) return;
            if (
                requiredPermissions.every(
                    (item) => permissions.indexOf(item) >= 0
                )
            ) {
                setCheckPermissionsStatus(AsyncStatus.SUCCESS);
            } else {
                setCheckPermissionsStatus(AsyncStatus.ERROR);
            }
        }, [permissions]);

        if (checkPermissionsStatus === AsyncStatus.LOADING) {
            return <SkeletonLoader text="Checking permissions" />;
        }

        if (!featureFlags.commAppIsEnabled) {
            return (
                <ErrorPage title="This app is currently disabled. See procosys.com for more info." />
            );
        }

        if (checkPermissionsStatus === AsyncStatus.SUCCESS) {
            return <WrappedComponent {...props} />;
        }

        return (
            <ErrorPage
                title="No access"
                description="You do not have permission to view this resource"
            />
        );
    };

export default withAccessControl;
