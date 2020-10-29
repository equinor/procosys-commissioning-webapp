import axios from 'axios';
import { Project } from '../components/pages/SelectProject';
import { Plant } from '../contexts/PlantAndProjectContext';

import PascalCaseConverter from '../utils/PascalCaseConverter';
import * as auth from './authService';

const baseURL = 'https://procosyswebapiqp.equinor.com/api/';

type PlantResponse = {
    Id: string;
    Title: string;
};

axios.interceptors.request.use(async (request) => {
    try {
        const token = await auth.getAccessToken();
        request.headers['Authorization'] = `Bearer ${token}`;
        return request;
    } catch (error) {
        console.log(error);
        return request;
    }
});

export const getPlants = async () => {
    try {
        const { data } = await axios.get(
            baseURL + 'Plants?includePlantsWithoutAccess=false&api-version=4.1'
        );
        const camelCasedResponse = PascalCaseConverter.objectToCamelCase(data);
        const camelCasedResponseWithSlug = camelCasedResponse.map(
            (plant: Plant) => ({
                ...plant,
                slug: plant.id.substr(4),
            })
        );
        return camelCasedResponseWithSlug as Plant[];
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getProjectsForPlant = async (plantId: string) => {
    try {
        const { data } = await axios.get(
            baseURL + `Projects?plantId=${plantId}&api-version=4.1`
        );
        return PascalCaseConverter.objectToCamelCase(data) as Project[];
    } catch (error) {
        return Promise.reject(error);
    }
};
