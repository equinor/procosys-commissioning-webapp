export const removeLastSubdirectory = (url: string) => {
    const matched = url.match(/.*\//);
    if (!matched) return '';
    return matched[0].slice(0, -1);
};
