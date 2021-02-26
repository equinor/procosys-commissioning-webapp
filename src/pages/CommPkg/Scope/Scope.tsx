import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import { ChecklistPreview } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';

export const CommPkgListWrapper = styled.div`
    padding-bottom: 85px;
    & h3 {
        text-align: center;
        margin-top: 16px;
    }
`;

export const PreviewButton = styled(Link)`
    display: flex;
    align-items: center;
    padding: 8px 0;
    margin: 10px 4% 0 4%;
    text-decoration: none;
    justify-content: space-between;
    & img {
        max-height: 20px;
        object-fit: contain;
        flex: 0.1;
    }
    & > div {
        margin-left: 24px;
        flex: 3;
        & p {
            margin: 0;
        }
    }
    & svg {
        flex: 0.5;
    }
`;

const FormulaTypeText = styled.p`
    padding-left: 12px;
    flex: 1;
`;

const Scope = () => {
    const { params, api, url } = useCommonHooks();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [fetchScopeStatus, setFetchScopeStatus] = useState(
        AsyncStatus.LOADING
    );
    useEffect(() => {
        (async () => {
            setFetchScopeStatus(AsyncStatus.LOADING);
            try {
                const scopeFromApi = await api.getScope(
                    params.plant,
                    params.commPkg
                );
                const sortedScope = scopeFromApi.sort((a, b) =>
                    a.tagNo.localeCompare(b.tagNo)
                );
                setScope(sortedScope);
                setFetchScopeStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchScopeStatus(AsyncStatus.ERROR);
            }
        })();
    }, [params.plant, params.commPkg, api]);

    const content = () => {
        if (
            fetchScopeStatus === AsyncStatus.SUCCESS &&
            scope &&
            scope.length > 0
        ) {
            return (
                <>
                    {scope.map((checklist) => (
                        <PreviewButton
                            key={checklist.id}
                            to={`${url}/${checklist.id}`}
                        >
                            <CompletionStatusIcon status={checklist.status} />
                            <div>
                                <label>{checklist.tagNo}</label>
                                <p>{checklist.tagDescription}</p>
                            </div>
                            <FormulaTypeText>
                                {checklist.formularType}
                            </FormulaTypeText>
                            <EdsIcon name="chevron_right" />
                        </PreviewButton>
                    ))}
                </>
            );
        } else if (
            fetchScopeStatus === AsyncStatus.SUCCESS &&
            scope &&
            scope.length < 1
        ) {
            return (
                <CommPkgListWrapper>
                    <h3>The scope is empty</h3>
                </CommPkgListWrapper>
            );
        } else if (fetchScopeStatus === AsyncStatus.ERROR) {
            return (
                <h4>
                    Unable to load scope. Please refresh or contact IT support
                </h4>
            );
        } else {
            return <SkeletonLoadingPage text="" />;
        }
    };

    return <CommPkgListWrapper>{content()}</CommPkgListWrapper>;
};

export default Scope;
