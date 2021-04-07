const removeLastSubdirectory = (url: string) => {
    const matched = url.match(/.*\//);
    if (!matched)
        throw Error('Routing failed: Unable to remove subdirectories');
    return matched[0].slice(0, -1);
};

const removeSubdirectories = (
    url: string,
    numberOfSubdirectoriesToRemove: number
) => {
    console.log(url);
    let modifiedUrl = url;
    for (let i = 0; i < numberOfSubdirectoriesToRemove; i++) {
        modifiedUrl = removeLastSubdirectory(modifiedUrl);
    }
    return modifiedUrl;
};

export default removeSubdirectories;
