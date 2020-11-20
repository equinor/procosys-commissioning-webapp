import React from 'react';

import leftGrey from '../assets/img/status/left_grey.png';
import leftYellow from '../assets/img/status/left_yellow.png';
import leftGreen from '../assets/img/status/left_green.png';
import leftRed from '../assets/img/status/left_red.png';

import rightYellow from '../assets/img/status/right_yellow.png';
import rightGrey from '../assets/img/status/right_grey.png';
import rightGreen from '../assets/img/status/right_green.png';
import rightRed from '../assets/img/status/right_red.png';

type PackageStatusIconProps = {
    mcStatus: string;
    commStatus: string;
};

const determineCommImage = (status: string) => {
    if (status === 'OK') return leftGreen;
    if (status === 'OS') return leftGrey;
    if (status === 'PA') return leftRed;
    if (status === 'PB') return leftYellow;
};

const determineMCImage = (status: string) => {
    if (status === 'OK') return rightGreen;
    if (status === 'OS') return rightGrey;
    if (status === 'PA') return rightRed;
    if (status === 'PB') return rightYellow;
};

const PackageStatusIcon = ({
    mcStatus,
    commStatus,
}: PackageStatusIconProps) => {
    return (
        <>
            <img
                src={determineCommImage(commStatus)}
                alt={'Comm package status indicator, left side'}
            />
            <img
                src={determineMCImage(mcStatus)}
                alt={'MC package status indicator, right side'}
            />
        </>
    );
};

export default PackageStatusIcon;
