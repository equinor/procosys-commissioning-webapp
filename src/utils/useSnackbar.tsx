import React, { useEffect, useState } from 'react';
import { Snackbar as EdsSnackbar } from '@equinor/eds-core-react';

const useSnackbar = () => {
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const snackbar = (
        <EdsSnackbar
            autoHideDuration={3000}
            onClose={() => {
                setShowSnackbar(false);
                setSnackbarText('');
            }}
            open={showSnackbar}
        >
            {snackbarText}
        </EdsSnackbar>
    );

    useEffect(() => {
        if (snackbarText.length < 1) return;
        setShowSnackbar(true);
    }, [snackbarText]);

    return {
        setSnackbarText,
        snackbar,
    };
};

export default useSnackbar;
