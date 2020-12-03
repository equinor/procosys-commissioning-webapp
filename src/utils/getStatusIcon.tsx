import greyStatus from '../assets/img/scopeStatusGrey.png';
import greenStatus from '../assets/img/scopeStatusGreen.png';
import paStatus from '../assets/img/scopeStatusPa.png';
import pbStatus from '../assets/img/scopeStatusPb.png';
import React from 'react';

export const scopeStatus = (status: string) => {
    if (status === 'OS') return <img src={greyStatus} alt="OS" />;
    if (status === 'OK') return <img src={greenStatus} alt="OK" />;
    if (status === 'PA') return <img src={paStatus} alt="PA" />;
    if (status === 'PB') return <img src={pbStatus} alt="PB" />;
    return status;
};
