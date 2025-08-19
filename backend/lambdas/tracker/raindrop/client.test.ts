
import axios from 'axios';
import { createRaindropApiClient, RaindropApiClient, RaindropApiErrorCodes, RaindropErrorCause } from './client';
import { CollectionItem } from './interfaces/collection';
import { RaindropItem } from './interfaces/raindrop';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Raindrop API Client', () => {
    let testClient: RaindropApiClient;
    let consoleErrorSpy: jest.SpyInstance;
    
    beforeEach(() => {
        // Reset mocks before each test
        mockedAxios.create.mockClear();
        mockedAxios.get.mockClear();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        // Setup the mock for axios.create() to return the mockedAxios instance
        mockedAxios.create.mockReturnValue(mockedAxios);
        testClient = createRaindropApiClient('test-token');
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    /**
     * Helper method to create a dummy error with a cause property.
     * @returns {Error} - A dummy error with a cause property that matches the expected RaindropErrorCause interface.
     */
    const createDummyErrorWithCause = (): Error => {
        return new Error('dummy', { 
            cause: {
                code: 'dummy',
                message: 'dummy'
            } as RaindropErrorCause
        });
    };

    describe('createRaindropApiClient', () => {
        it('should throw an error if no API token is provided', () => {
            let caughtError: Error = createDummyErrorWithCause();
            try {
                createRaindropApiClient('');
            } catch (error: unknown) {
                caughtError = error as Error;
            }
            const caughtErrorCause = caughtError.cause as RaindropErrorCause;
            expect(caughtErrorCause.code).toBe(RaindropApiErrorCodes.MissingApiToken);
        });

        it('should return a client with getCollections and getRaindrops methods', () => {
            const client = createRaindropApiClient('valid-test-token');
            expect(client).toBeDefined();
            expect(typeof client.getCollections).toBe('function');
            expect(typeof client.getRaindrops).toBe('function');
        });
    });

    describe('getCollections', () => {
        it('should throw a specific error when the API response has result: false', async () => {
            const mockedResponseWithResultReturningFalse = { result: false, errorMessage: 'API Error' };
            mockedAxios.get.mockResolvedValue({ data: mockedResponseWithResultReturningFalse });

            let caughtError: Error = createDummyErrorWithCause();
            try {
                await testClient.getCollections();
            } catch (error: unknown) {
                caughtError = error as Error;
            }

            const caughtErrorCause = caughtError.cause as RaindropErrorCause;
            expect(caughtErrorCause).toBeDefined();
            expect(caughtErrorCause.code).toBe(RaindropApiErrorCodes.CollectionsFetchError);
        });

        it('should throw a formatted error when the API returns a non-2xx status code', async () => {
            const mockResponseWithNon200StatusCode = {
                response: {
                    status: 500,
                    data: { errorMessage: 'Server Error' },
                },
            };
            mockedAxios.get.mockRejectedValue(mockResponseWithNon200StatusCode);
            let caughtError: Error = createDummyErrorWithCause();
            try {
                await testClient.getCollections();
            } catch (error: unknown) {
                caughtError = error as Error;
            }
            const caughtErrorCause = caughtError.cause as RaindropErrorCause;
            expect(caughtErrorCause.code).toBe(RaindropApiErrorCodes.CollectionsFetchError);
        });
        
        it('should return a list of collections on successful API call', async () => {
            const validCollectionsResult: CollectionItem[] = [{ _id: 1, title: 'Test Collection' } as CollectionItem];
            mockedAxios.get.mockResolvedValue({ data: { result: true, items: validCollectionsResult } });

            const result = await testClient.getCollections();
            expect(result).toEqual(validCollectionsResult);
        });
    });

    describe('getRaindrops', () => { 
        it('should throw a specific error when the API response has result: false', async () => {
            const dummyCollectionId = 123;
            const mockedResultWithResultFalse = { result: false, errorMessage: 'API Error' };
            mockedAxios.get.mockResolvedValue({ data: mockedResultWithResultFalse });

            let caughtError: Error = createDummyErrorWithCause();
            try {
                await testClient.getRaindrops(dummyCollectionId);
            } catch (error: unknown) {
                caughtError = error as Error;
            }
            const caughtErrorCause = caughtError.cause as RaindropErrorCause;
            expect(caughtErrorCause).toBeDefined();
            expect(caughtErrorCause.code).toBe(RaindropApiErrorCodes.RaindropsFetchError);
        });

        it('should throw a formatted error when the API returns a non-2xx status code', async () => {
            const dummyCollectionId = 123;
            const mockResponseWithNon200StatusCode = {
                response: {
                    status: 500,
                    data: { errorMessage: 'Server Error' },
                },
            };
            mockedAxios.get.mockRejectedValue(mockResponseWithNon200StatusCode);
            let caughtError: Error = createDummyErrorWithCause();
            try {
                await testClient.getRaindrops(dummyCollectionId);
            } catch (error: unknown) {
                caughtError = error as Error;
            }
            const caughtErrorCause = caughtError.cause as RaindropErrorCause;
            expect(caughtErrorCause.code).toBe(RaindropApiErrorCodes.RaindropsFetchError);
        });

        it('should return a list of raindrops on successful API call', async () => {
            const dummyCollectionId = 123;
            const validRaindropsResult: RaindropItem[] = [{ _id: 1, title: 'Test Raindrop' } as RaindropItem];
            mockedAxios.get.mockResolvedValue({ data: { result: true, items: validRaindropsResult } });

            const result = await testClient.getRaindrops(dummyCollectionId);
            expect(result).toEqual(validRaindropsResult);
        });
    });
}); 