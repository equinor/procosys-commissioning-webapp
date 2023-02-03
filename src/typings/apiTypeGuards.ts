import { Attachment, isOfType } from '@equinor/procosys-webapp-components';
import { SearchType } from '../pages/Search/Search';
import { CommPkg, Tag, Person } from '../typings/apiTypes';

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

export const isArrayOfAttachments = (data: unknown): data is Attachment[] => {
    return Array.isArray(data) && data.every(isAttachment);
};

const isAttachment = (data: unknown): data is Attachment => {
    return data != null && typeof (data as Attachment).hasFile === 'boolean';
};

export const isArrayofPerson = (data: unknown): data is Person[] => {
    return Array.isArray(data) && data.every(isPerson);
};

const isPerson = (data: unknown): data is Person => {
    return data != null && typeof (data as Person).firstName === 'string';
};
