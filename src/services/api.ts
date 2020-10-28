import axios from 'axios';
import { Plant } from '../contexts/PlantAndProjectContext';
import PascalCaseConverter from '../utils/PascalCaseConverter';
import slugify from '../utils/Slugify';
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
        const camelCasedResponse = PascalCaseConverter.objectToCamelCase(
            data
        ) as Plant[];
        const camelCasedResponseWithSlug = camelCasedResponse.map((plant) => ({
            ...plant,
            slug: plant.id.substr(4),
        }));
        return Promise.resolve(camelCasedResponseWithSlug);
    } catch (error) {
        return Promise.reject(error);
    }
};
