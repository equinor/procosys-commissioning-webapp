import { useContext, useEffect, useState } from 'react';
import { DetailsCardInfo } from '../CommPkg/DetailsCard';
import PlantContext from '../../contexts/PlantContext';

export enum StorageKey {
    PLANT = 'currentPlant',
    PROJECT = 'currentProject',
    BOOKMARK = 'Procosys Bookmark',
}

function isACommPkg(toBeDetermined: any): toBeDetermined is DetailsCardInfo {
    if ((toBeDetermined as DetailsCardInfo).pkgNumber) {
        return true;
    }
    return false;
}

const removeDuplicateCommPkgs = (packages: DetailsCardInfo[]) => {
    const arrayOfUniqueCommPkgNos = Array.from(
        new Set(packages.map((commPkg) => commPkg.pkgNumber))
    );
    return arrayOfUniqueCommPkgNos.map((commPkgNo) => {
        return packages.find((commPkg) => commPkg.pkgNumber === commPkgNo);
    }) as DetailsCardInfo[];
};

const cleanUpBookmarks = (bookmarks: any) => {
    const commPkgs: DetailsCardInfo[] = bookmarks.filter(
        (bookmark: any) => !!bookmark && isACommPkg(bookmark)
    );
    return removeDuplicateCommPkgs(commPkgs);
};

export const getCurrentBookmarks = (projectId: string) => {
    const bookmarksFromLocalStorage = window.localStorage.getItem(
        `${StorageKey.BOOKMARK}: ${projectId}`
    );
    if (bookmarksFromLocalStorage)
        return cleanUpBookmarks(JSON.parse(bookmarksFromLocalStorage));
    return [];
};

const useBookmarks = (details: DetailsCardInfo) => {
    const { currentProject } = useContext(PlantContext);
    const projectId = currentProject?.id.toString() as string;
    const [currentBookmarks, setCurrentBookmarks] = useState<
        DetailsCardInfo[]
    >();
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Set current bookmarks to whatever is in local storage
    useEffect(() => {
        setCurrentBookmarks(getCurrentBookmarks(projectId));
    }, [projectId]);

    // Set isBookmarked to true if package exists in localstorage
    useEffect(() => {
        if (!currentBookmarks) return;
        setIsBookmarked(
            currentBookmarks.some(
                (commPkg) => commPkg.pkgNumber === details.pkgNumber
            )
        );
    }, [currentBookmarks, details.pkgNumber]);

    // Update currentbookmarks whenever user bookmarks/unbookmarks a pkg
    useEffect(() => {
        if (!currentBookmarks) return;
        if (isBookmarked) {
            if (!details) return;
            setCurrentBookmarks([...currentBookmarks, details]);
        } else {
            if (currentBookmarks.length < 1) return;
            setCurrentBookmarks(
                currentBookmarks.filter(
                    (CommPkg) => CommPkg.pkgNumber !== details.pkgNumber
                )
            );
        }
    }, [isBookmarked]);

    // Set current bookmark state to localstorage whenever it changes
    useEffect(() => {
        if (!currentBookmarks) return;
        window.localStorage.setItem(
            `${StorageKey.BOOKMARK}: ${projectId}`,
            JSON.stringify(cleanUpBookmarks(currentBookmarks))
        );
    }, [currentBookmarks]);

    return {
        setIsBookmarked,
        isBookmarked,
    };
};

export default useBookmarks;
