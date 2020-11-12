import React, { useState, useEffect, useContext, ReactElement } from 'react';
import PlantContext from '../contexts/PlantContext';
import { H3 } from '../style/text';

const withAccessControl = (
    WrappedComponent: () => ReactElement,
    requiredPermissions: string[] = []
) => (props: JSX.IntrinsicAttributes) => {
    const [hasAccess, setHasAccess] = useState<boolean>(false);
    const { permissions } = useContext(PlantContext);
    useEffect(() => {
        if (
            requiredPermissions.every((item) => permissions.indexOf(item) >= 0)
        ) {
            setHasAccess(true);
        } else {
            setHasAccess(false);
        }
    }, [permissions]);

    if (hasAccess) {
        return <WrappedComponent {...props} />;
    }
    return <H3>You do not have access to this resource</H3>;
};

export default withAccessControl;
