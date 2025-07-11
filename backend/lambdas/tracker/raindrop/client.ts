import axios, { AxiosInstance, isAxiosError } from 'axios';
import { CollectionsApiResponse, CollectionItem } from './interfaces/collection';
import { RaindropsApiResponse, RaindropItem } from './interfaces/raindrop';

// --- Private Helper Function ---

/**
 * A private helper function to centralize error handling for API calls.
 * It logs a descriptive error message and returns an Error object to be thrown.
 * @param error - The error object caught from the API call.
 * @param contextMessage - A message describing the context of the operation.
 */
const handleApiError = (error: unknown, contextMessage: string): Error => {
  let errorMessage = `${contextMessage}.`;
  
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const apiErrorMessage = (error.response.data as RaindropsApiResponse | CollectionsApiResponse)?.errorMessage;
      errorMessage += ` Server responded with status ${error.response.status}${apiErrorMessage ? `: ${apiErrorMessage}` : ''}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage += ' No response received from the server.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage += ` Error during request setup: ${error.message}`;
    }
  } else if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status: number; data?: { errorMessage?: string } }, request?: any, message: string };
      if(axiosError.response){
        const apiErrorMessage = axiosError.response.data?.errorMessage;
        errorMessage += ` Server responded with status ${axiosError.response.status}${apiErrorMessage ? `: ${apiErrorMessage}` : ''}`;
      } else {
        errorMessage += ` An unexpected error occurred: ${axiosError.message}`;
      }
  }
  else if (error instanceof Error) {
    errorMessage += ` An unexpected error occurred: ${error.message}`;
  } else {
    errorMessage += ' An unknown error occurred.';
  }

  console.error(errorMessage);
  return new Error(errorMessage);
};


// --- Public API Client ---

/**
 * Defines the shape of the functional Raindrop.io API client.
 */
export interface RaindropApiClient {
  /**
   * 
   * Fetches all collections for the authenticated user.
   * @returns A promise that resolves to an array of CollectionItem objects.
   */
  getCollections: () => Promise<CollectionItem[]>;
  
  /**
   * Fetches all raindrops from a specific collection.
   * @param collectionId - The ID of the collection from which to fetch raindrops.
   * Special Collection IDs include: 0 (All), -1 (Unsorted), -99 (Trash)
   * @returns A promise that resolves to an array of RaindropItem objects.
   */
  getRaindrops: (collectionId: number) => Promise<RaindropItem[]>;
}

const API_BASE_URL = process.env.RAINDROP_API_BASE_URL || 'https://api.raindrop.io/rest/v1';

const getRaindropCollections = (client: AxiosInstance): () => Promise<CollectionItem[]> => {
  return async (): Promise<CollectionItem[]> => {
    try {
      const response = await client.get<CollectionsApiResponse>('/collections');
      if (response.data.result) {
        return response.data.items;
      }
      throw new Error(`The Raindrop.io API indicated a failure in fetching collections: ${response.data.errorMessage || 'Unknown Reason'}`);
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch collections');
    }
  };
}

const getRaindropItems = (client: AxiosInstance): (collectionId: number) => Promise<RaindropItem[]> => {
  return async (collectionId: number): Promise<RaindropItem[]> => {
    try {
      const response = await client.get<RaindropsApiResponse>(`/raindrops/${collectionId}?sort=-created&perpage=3`);
      if (response.data.result) {
        return response.data.items;
      }
      throw new Error(`The Raindrop.io API indicated a failure in fetching raindrops for collection ID ${collectionId}: ${response.data.errorMessage || 'Unknown Reason'}`);
    } catch (error) {
      throw handleApiError(error, `Failed to fetch raindrops for collection ID ${collectionId}`);
    }
  };
};

/**
 * Creates a functional client for interacting with the Raindrop.io REST API.
 * @param apiToken - Your personal API token from Raindrop.io integrations.
 * @returns An object with methods for interacting with the API.
 */
export const createRaindropApiClient = (apiToken: string): RaindropApiClient => {
  if (!apiToken) {
    throw new Error('An API token is required to communicate with the Raindrop.io API.');
  }

  const client: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
  });

  return {
    getCollections: getRaindropCollections(client),
    getRaindrops: getRaindropItems(client),
  };
};