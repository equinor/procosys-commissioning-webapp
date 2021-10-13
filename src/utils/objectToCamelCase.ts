function isObject(subject: unknown): subject is Record<string, unknown> {
    return (
        subject === Object(subject) &&
        !Array.isArray(subject) &&
        typeof subject !== 'function'
    );
}

const stringToCamelCase = (input: string): Uncapitalize<string> => {
    return input[0].toLowerCase() + input.substr(1, input.length);
};

const objectToCamelCase = (input: unknown): unknown => {
    if (isObject(input)) {
        const n: Record<string, unknown> = {};
        Object.keys(input).forEach(
            (k) => (n[stringToCamelCase(k)] = objectToCamelCase(input[k]))
        );
        return input;
    } else if (Array.isArray(input)) {
        return input.map((i) => {
            return objectToCamelCase(i);
        });
    } else {
        return input;
    }
};

export default objectToCamelCase;
