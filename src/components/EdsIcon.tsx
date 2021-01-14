import {
    menu,
    chevron_right,
    chevron_down,
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
    warning_outlined,
    warning_filled,
    radio_button_selected,
    radio_button_unselected,
    swap_horizontal,
    arrow_drop_right,
    info_circle,
    checkbox,
    checkbox_outline,
} from '@equinor/eds-icons';
import { Icon } from '@equinor/eds-core-react';
import React from 'react';

Icon.add({
    menu,
    chevron_right,
    chevron_down,
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
    warning_outlined,
    warning_filled,
    radio_button_selected,
    radio_button_unselected,
    swap_horizontal,
    arrow_drop_right,
    info_circle,
    checkbox,
    checkbox_outline,
});

type IconProps = {
    name?: string;
    title?: string;
    color?: string;
    size?: 16 | 24 | 32 | 40 | 48 | undefined;
    quantity?: number;
    alt?: string;
};

const EdsIcon = ({ name, title, color, size }: IconProps): JSX.Element => {
    return <Icon name={name} title={title} color={color} size={size} />;
};

export default EdsIcon;
