import { CompletionStatus, PunchPreview } from '../services/apiTypes';

export const removeSubdirectories = (
    url: string,
    numberOfSubdirectoriesToRemove: number
) => {
    let modifiedUrl = url;
    for (let i = 0; i < numberOfSubdirectoriesToRemove; i++) {
        modifiedUrl = removeLastSubdirectory(modifiedUrl);
    }
    return modifiedUrl;
};
const removeLastSubdirectory = (url: string) => {
    const matched = url.match(/.*\//);
    if (!matched)
        throw Error('Routing failed: Unable to remove subdirectories');
    return matched[0].slice(0, -1);
};

export function ensure<T>(
    argument: T | undefined | null,
    message: string = 'This value was promised to be there.'
): T {
    if (argument === undefined || argument === null) {
        throw new TypeError(message);
    }

    return argument;
}

export const calculateHighestStatus = (punchList: PunchPreview[]) => {
    if (punchList.find((punch) => punch.status === 'PA'))
        return CompletionStatus.PA;
    if (punchList.find((punch) => punch.status === 'PB'))
        return CompletionStatus.PB;
    return CompletionStatus.OK;
};
