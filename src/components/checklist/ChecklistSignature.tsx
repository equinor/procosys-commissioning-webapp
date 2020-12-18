import React from 'react';
import { ChecklistDetails } from '../../services/apiTypes';

type ChecklistSignatureProps = {
    details: ChecklistDetails;
};

const ChecklistSignature = ({ details }: ChecklistSignatureProps) => {
    return <div>signed by {details.signedByFirstName}</div>;
};

export default ChecklistSignature;
