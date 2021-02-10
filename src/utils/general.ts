import { CompletionStatus, PunchPreview } from '../services/apiTypes';

export const removeLastSubdirectory = (url: string) => {
    const matched = url.match(/.*\//);
    if (!matched) return '';
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
