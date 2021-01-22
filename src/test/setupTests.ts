import '@testing-library/jest-dom/extend-expect';
import '@equinor/eds-core-react';
import './setupServer';

//Fixes MSAL interfering with the globals
const crypto = require('crypto');
Object.defineProperty(global, 'crypto', {
    value: {
        getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
    },
});
