import React from 'react';
import EdsIcon from '../components/icons/EdsIcon';
import { AsyncStatus } from '../contexts/CommAppContext';
import { COLORS } from '../style/GlobalStyles';

export const determineVariant = (status: AsyncStatus) => {
    if (status === AsyncStatus.ERROR) return 'error';
    if (status === AsyncStatus.SUCCESS) return 'success';
    return 'default';
};

export const determineHelperText = (status: AsyncStatus) => {
    if (status === AsyncStatus.ERROR) return 'Unable to save comment.';
    if (status === AsyncStatus.SUCCESS) return 'Comment saved.';
    if (status === AsyncStatus.LOADING) return 'Saving.';
    return '';
};
