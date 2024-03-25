import '@testing-library/jest-dom';
import '@equinor/eds-core-react';
import './setupServer';
import { configure } from '@testing-library/react';
declare global {
    interface Window {
        URL: any;
    }
    interface FormData {
        append(): any;
    }
}

configure({
    getElementError: (message: string | null) => {
        if (!message) return new Error('no error message');
        const error = new Error(message);
        error.name = 'TestingLibraryElementError';
        error.stack = undefined;
        return error;
    },
});
