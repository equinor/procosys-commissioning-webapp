import React from 'react';
import { CommPackageContextProvider } from './contexts/CommPackageContext';
import CommPkgPage from './pages/CommPkgPage';

const CommPkgRouter = () => {
    return (
        <CommPackageContextProvider>
            <CommPkgPage />
        </CommPackageContextProvider>
    );
};

export default CommPkgRouter;
