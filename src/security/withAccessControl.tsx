import React, { useState, useEffect, useContext, ReactElement } from 'react';
import FullPageLoader from '../components/loading/FullPageLoader';
import PlantContext from '../contexts/PlantContext';
import { AsyncStatus } from '../contexts/UserContext';
import { H3 } from '../style/text';

const withAccessControl = (
    WrappedComponent: () => ReactElement,
    requiredPermissions: string[] = []
) => (props: JSX.IntrinsicAttributes) => {
    const [hasAccess, setHasAccess] = useState<boolean>(false);
    const { permissions, fetchPermissionsStatus } = useContext(PlantContext);

    alert('reached permissions');
    useEffect(() => {
        if (
            requiredPermissions.every((item) => permissions.indexOf(item) >= 0)
        ) {
            setHasAccess(true);
        } else {
            setHasAccess(false);
        }
    }, [permissions]);

    if (fetchPermissionsStatus === AsyncStatus.LOADING) {
        return <FullPageLoader text={'Loading permissions...'} />;
    }

    if (fetchPermissionsStatus === AsyncStatus.ERROR) {
        return <H3>Error loading permissions</H3>;
    }

    if (hasAccess) {
        return <WrappedComponent {...props} />;
    }
    return <H3>You do not have access to this resource</H3>;
};

export default withAccessControl;
