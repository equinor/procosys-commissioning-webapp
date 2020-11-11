import '@testing-library/jest-dom/extend-expect';
import '@equinor/eds-core-react';

const crypto = require('crypto');

Object.defineProperty(global, 'crypto', {
    value: {
        getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
    },
});
