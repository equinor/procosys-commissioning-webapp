import React from 'react';
import EdsIcon from '../components/icons/EdsIcon';
import { AsyncStatus } from '../contexts/CommAppContext';
import { COLORS } from '../style/GlobalStyles';

enum TextFieldVariants {
    ERROR = 'error',
    SUCCESS = 'success',
}

export const determineVariant = (
    status: AsyncStatus
): TextFieldVariants | undefined => {
    if (status === AsyncStatus.ERROR) return TextFieldVariants.ERROR;
    if (status === AsyncStatus.SUCCESS) return TextFieldVariants.SUCCESS;
    return undefined;
};

export const determineHelperText = (status: AsyncStatus): string => {
    if (status === AsyncStatus.ERROR) return 'Unable to save comment.';
    if (status === AsyncStatus.SUCCESS) return 'Comment saved.';
    if (status === AsyncStatus.LOADING) return 'Saving.';
    return '';
};
