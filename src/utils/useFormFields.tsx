import React from 'react';

function useFormFields<T>(initialValues: T) {
    const [formFields, setFormFields] = React.useState<T>(initialValues);
    const createChangeHandler = (key: keyof T) => (
        e: React.ChangeEvent<
            HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement
        >
    ) => {
        const value = e.target.value;
        setFormFields((prev: T) => ({ ...prev, [key]: value }));
    };
    return { formFields, createChangeHandler };
}

export default useFormFields;
