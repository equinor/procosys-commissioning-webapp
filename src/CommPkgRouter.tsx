import React from 'react';
import { CommPkgContextProvider } from './contexts/CommPkgContext';
import CommPkg from './pages/CommPkg';

const CommPkgRouter = () => {
    return (
        <CommPkgContextProvider>
            <CommPkg />
        </CommPkgContextProvider>
    );
};

export default CommPkgRouter;
