// TODO: figure out what to do with the function below
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const buildEndpoint = () => {
    const getChecklistAttachments = (
        plantId: string,
        checklistId: string
    ): string => {
        return `CheckList/Attachments?plantId=PCS$${plantId}&checkListId=${checklistId}&thumbnailSize=32`;
    };
    const getPunchAttachments = (
        plantId: string,
        punchItemId: string
    ): string => {
        return `PunchListItem/Attachments?plantId=PCS$${plantId}&punchItemId=${punchItemId}&thumbnailSize=32`;
    };
    return {
        getChecklistAttachments,
        getPunchAttachments,
    };
};

export default buildEndpoint;
