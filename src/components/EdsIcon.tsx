import {
    menu,
    chevron_right,
    arrow_drop_down,
    error_outlined,
    close,
    bookmark_outlined,
    bookmark_filled,
    check_circle,
    list,
    paste,
    view_list,
    remove,
    check_circle_outlined,
    arrow_back,
    search,
} from '@equinor/eds-icons';
import { Icon } from '@equinor/eds-core-react';
import React from 'react';

Icon.add({
    menu,
    chevron_right,
    arrow_drop_down,
    error_outlined,
    close,
    bookmark_outlined,
    bookmark_filled,
    check_circle,
    list,
    paste,
    view_list,
    remove,
    check_circle_outlined,
    arrow_back,
    search,
});

type IconProps = {
    name?: string;
    title?: string;
    color?: string;
    rotation?: number;
    size?: number;
    quantity?: number;
    alt?: string;
};

const EdsIcon = ({
    name,
    title,
    color = 'black',
    rotation,
    size,
}: IconProps): JSX.Element => {
    return (
        <Icon
            name={name}
            title={title}
            color={color}
            rotation={rotation}
            size={size}
        />
    );
};

export default EdsIcon;
