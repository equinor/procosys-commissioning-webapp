import { isOfType } from '@equinor/procosys-webapp-components';
import { SearchType } from '../pages/Search/Search';
import { CommPkg, Tag } from './apiTypes';

export const isCorrectDetails = (
    data: unknown,
    searchType: string
): data is CommPkg | Tag => {
    if (searchType === SearchType.Comm) {
        return isOfType<CommPkg>(data, 'commStatus');
    } else if (searchType === SearchType.Tag) {
        return isOfType<Tag>(data, 'tag');
    } else {
        return false;
    }
};
