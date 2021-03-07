import React from 'react';
import EdsIcon from '../components/icons/EdsIcon';
import { AsyncStatus } from '../contexts/CommAppContext';

export const determineHelperIcon = (status: AsyncStatus) => {
    if (status === AsyncStatus.ERROR) {
        return <EdsIcon size={16} name="error_filled" color="#EB0000" />;
    }
    if (status === AsyncStatus.SUCCESS) {
        return <EdsIcon size={16} name="thumbs_up" color="#4BB748" />;
    }
    if (status === AsyncStatus.LOADING) {
        return <></>;
    }
};

export const determineVariant = (status: AsyncStatus) => {
    if (status === AsyncStatus.ERROR) return 'error';
    if (status === AsyncStatus.SUCCESS) return 'success';
    return 'default';
};

export const determineHelperText = (
    status: AsyncStatus,
    errorMessage?: string
) => {
    if (status === AsyncStatus.ERROR) return 'Unable to save comment.';
    if (status === AsyncStatus.SUCCESS) return 'Comment saved.';
    if (status === AsyncStatus.LOADING) return 'Saving...';
    return '';
};
