const buildEndpoint = () => {
    const getChecklistAttachments = (plantId: string, checklistId: string) => {
        return `CheckList/Attachments?plantId=PCS$${plantId}&checkListId=${checklistId}&thumbnailSize=32`;
    };
    const getPunchAttachments = (plantId: string, punchItemId: string) => {
        return `PunchListItem/Attachments?plantId=PCS$${plantId}&punchItemId=${punchItemId}&thumbnailSize=32`;
    };
    return {
        getChecklistAttachments,
        getPunchAttachments,
    };
};

export default buildEndpoint;
