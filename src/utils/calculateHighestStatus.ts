import { CompletionStatus } from '@equinor/procosys-webapp-components';
import { PunchPreview } from '../typings/apiTypes';

const calculateHighestStatus = (
    punchList: PunchPreview[]
): CompletionStatus => {
    if (punchList.find((punch) => punch.status === 'PA'))
        return CompletionStatus.PA;
    if (punchList.find((punch) => punch.status === 'PB'))
        return CompletionStatus.PB;
    return CompletionStatus.OK;
};

export default calculateHighestStatus;
