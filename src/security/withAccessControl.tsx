import React, { useState, useEffect, useContext, ReactElement } from 'react';
import ErrorPage from '../components/error/ErrorPage';
import SkeletonLoadingPage from '../components/loading/SkeletonLoadingPage';
import PlantContext from '../contexts/PlantContext';
import { AsyncStatus } from '../contexts/UserContext';

const withAccessControl = (
    WrappedComponent: () => ReactElement,
    requiredPermissions: string[] = []
) => (props: JSX.IntrinsicAttributes) => {
    const { permissions } = useContext(PlantContext);
    const [checkPermissionsStatus, setCheckPermissionsStatus] = useState(
        AsyncStatus.LOADING
    );
    useEffect(() => {
        if (permissions.length < 1) return;
        if (
            requiredPermissions.every((item) => permissions.indexOf(item) >= 0)
        ) {
            setCheckPermissionsStatus(AsyncStatus.SUCCESS);
        } else {
            setCheckPermissionsStatus(AsyncStatus.ERROR);
        }
    }, [permissions]);

    if (checkPermissionsStatus === AsyncStatus.LOADING) {
        return <SkeletonLoadingPage text="Checking permissions . . ." />;
    }

    if (checkPermissionsStatus === AsyncStatus.SUCCESS) {
        return <WrappedComponent {...props} />;
    }

    return (
        <ErrorPage
            errorTitle="No access"
            errorDescription="You do not have permission to view this resource"
        />
    );
};

export default withAccessControl;
