
import axios from 'axios';
import { createRaindropApiClient, RaindropApiClient } from './client';
import { CollectionItem } from './interfaces/collection';
import { RaindropItem } from './interfaces/raindrop';

// TODO: Verify that jest is available in package.json
// TODO: Add tests to github actions

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Raindrop API Client', () => {
    let client: RaindropApiClient;

    beforeEach(() => {
        // Reset mocks before each test
        mockedAxios.create.mockClear();
        mockedAxios.get.mockClear();
        
        // Setup the mock for axios.create() to return the mockedAxios instance
        mockedAxios.create.mockReturnValue(mockedAxios);
        client = createRaindropApiClient('test-token');
    });

    describe('createRaindropApiClient', () => {
        it('should throw an error if no API token is provided', () => {
            expect(() => createRaindropApiClient('')).toThrow('An API token is required to communicate with the Raindrop.io API.');
        });

        it('should return a client with getCollections and getRaindrops methods', () => {
            const client = createRaindropApiClient('test-token');
            expect(client).toHaveProperty('getCollections');
            expect(client).toHaveProperty('getRaindrops');
        });
    });

    describe('getCollections', () => {
        it('should return a list of collections on successful API call', async () => {
            const collections: CollectionItem[] = [{ _id: 1, title: 'Test Collection' } as CollectionItem];
            mockedAxios.get.mockResolvedValue({ data: { result: true, items: collections } });

            const result = await client.getCollections();
            expect(result).toEqual(collections);
            expect(mockedAxios.get).toHaveBeenCalledWith('/collections');
        });

        it('should throw a specific error when the API response has result: false', async () => {
            mockedAxios.get.mockResolvedValue({ data: { result: false, errorMessage: 'API Error' } });
            await expect(client.getCollections()).rejects.toThrow('The Raindrop.io API indicated a failure in fetching collections: API Error');
        });

        it('should throw a formatted error when the API returns a non-2xx status code', async () => {
            const error = {
                response: {
                    status: 500,
                    data: { errorMessage: 'Server Error' },
                },
            };
            mockedAxios.get.mockRejectedValue(error);
            await expect(client.getCollections()).rejects.toThrow('Failed to fetch collections. Server responded with status 500: Server Error');
        });
    });

    describe('getRaindrops', () => {
        const collectionId = 123;

        it('should return a list of raindrops on successful API call', async () => {
            const raindrops: RaindropItem[] = [{ _id: 1, title: 'Test Raindrop' } as RaindropItem];
            mockedAxios.get.mockResolvedValue({ data: { result: true, items: raindrops } });

            const result = await client.getRaindrops(collectionId);
            expect(result).toEqual(raindrops);
            expect(mockedAxios.get).toHaveBeenCalledWith(`/raindrops/${collectionId}?sort=-created&perpage=3`);
        });

        it('should throw a specific error when the API response has result: false', async () => {
            mockedAxios.get.mockResolvedValue({ data: { result: false, errorMessage: 'API Error' } });
            await expect(client.getRaindrops(collectionId)).rejects.toThrow(`The Raindrop.io API indicated a failure in fetching raindrops for collection ID ${collectionId}: API Error`);
        });

        it('should throw a formatted error when the API returns a non-2xx status code', async () => {
            const error = {
                response: {
                    status: 500,
                    data: { errorMessage: 'Server Error' },
                },
            };
            mockedAxios.get.mockRejectedValue(error);
            await expect(client.getRaindrops(collectionId)).rejects.toThrow(`Failed to fetch raindrops for collection ID ${collectionId}. Server responded with status 500: Server Error`);
        });
    });
}); 