import React from 'react';
import { Button } from '@equinor/eds-core-react';
import { removeSubdirectories } from '@equinor/procosys-webapp-components';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import useCommonHooks from '../../../utils/useCommonHooks';

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

const NewPunchSuccessPage = (): JSX.Element => {
    const { history, url } = useCommonHooks();
    return (
        <NewPunchSuccess>
            <EdsIcon name="check" size={40} />
            <h4>Successfully added new punch</h4>
            <ButtonGroup>
                <Button
                    onClick={(): void =>
                        history.push(removeSubdirectories(url, 2))
                    }
                >
                    Back to checklist
                </Button>
                <Button
                    onClick={(): void =>
                        history.push(removeSubdirectories(url, 1))
                    }
                >
                    Go to punch list
                </Button>
            </ButtonGroup>
        </NewPunchSuccess>
    );
};

export default NewPunchSuccessPage;
