import { EntityDetails, TextIcon } from '@equinor/procosys-webapp-components';
import React from 'react';
import { PackageStatusIcon } from '../../../components/icons/PackageStatusIcon';
import {
    CommPkgPreview,
    SearchResults,
    TagPreview,
} from '../../../services/apiTypes';
import { COLORS } from '../../../style/GlobalStyles';
import useCommonHooks from '../../../utils/useCommonHooks';
import { SearchType } from '../Search';
import { isArrayOfType } from './tempHelpers';

type ResultsListProps = {
    searchType: string;
    searchResults: SearchResults;
};

const ResultsList = ({
    searchType,
    searchResults,
}: ResultsListProps): JSX.Element => {
    const { history, url } = useCommonHooks();
    if (
        searchType === SearchType.Comm &&
        isArrayOfType<CommPkgPreview>(searchResults.items, 'commPkgNo')
    ) {
        return (
            <>
                {searchResults.items.map((searchResult) => {
                    return (
                        <EntityDetails
                            key={searchResult.id}
                            icon={
                                <PackageStatusIcon
                                    mcStatus={searchResult.mcStatus}
                                    commStatus={searchResult.commStatus}
                                />
                            }
                            headerText={searchResult.commPkgNo}
                            description={searchResult.description}
                            onClick={(): void =>
                                history.push(`${url}/Comm/${searchResult.id}`)
                            }
                        />
                    );
                })}
            </>
        );
    } else if (
        searchType === SearchType.Tag &&
        isArrayOfType<TagPreview>(searchResults.items, 'tagNo')
    ) {
        return (
            <>
                {searchResults.items.map((searchResult) => {
                    return (
                        <EntityDetails
                            key={searchResult.id}
                            icon={
                                <TextIcon color={COLORS.tagIcon} text="Tag" />
                            }
                            headerText={searchResult.tagNo}
                            description={searchResult.description}
                            onClick={(): void =>
                                history.push(`${url}/Tag/${searchResult.id}`)
                            }
                        />
                    );
                })}
            </>
        );
    } else return <></>;
};

export default ResultsList;
