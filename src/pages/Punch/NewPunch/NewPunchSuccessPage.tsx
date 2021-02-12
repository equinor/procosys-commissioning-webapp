import { Button } from '@equinor/eds-core-react';
import React from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import { removeSubdirectories } from '../../../utils/general';
import { CommParams } from '../../../App';

const ButtonGroup = styled.div`
    display: flex;
    & button:first-of-type {
        margin-right: 16px;
    }
`;

const NewPunchSuccess = styled.div`
    padding: 0 4%;
    margin-top: 48px;
    height: calc(100vh - 54px);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const NewPunchSuccessPage = () => {
    const history = useHistory();
    const { plant, commPkg, project } = useParams<CommParams>();
    const { url } = useRouteMatch();
    return (
        <NewPunchSuccess>
            <EdsIcon name="check" size={40} />
            <h4>Successfully added new punch</h4>
            <ButtonGroup>
                <Button
                    onClick={() => history.push(removeSubdirectories(url, 1))}
                >
                    Back to checklist
                </Button>
                <Button
                    onClick={() =>
                        history.push(
                            `/${plant}/${project}/${commPkg}/punch-list`
                        )
                    }
                >
                    Go to punch list
                </Button>
            </ButtonGroup>
        </NewPunchSuccess>
    );
};

export default NewPunchSuccessPage;
