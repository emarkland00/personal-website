import dotenv from 'dotenv';
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import
import { createRaindropApiClient, RaindropApiClient } from './raindrop/client';
import { RaindropItem } from './raindrop/interfaces/raindrop';

// Load environment variables from .env file
dotenv.config();

const BUCKET_NAME = process.env.S3_BUCKET_NAME || '';
const KEY_NAME_JSON = process.env.S3_KEY_NAME_JSON || "assets/latest.json";
const s3 = new S3Client();

interface TrackerJson {
    source: string,
    title: string,
    url: string
}

async function putLatestToS3(jsString: string) {
    const params = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: KEY_NAME_JSON,
        Body: jsString,
        ACL: 'public-read',
        ContentType: 'application/json'
    });
    
    await s3.send(params);
    console.log(`Upload complete to ${KEY_NAME_JSON}`);
}

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    // pocket api constants
    const accessToken: string = process.env.RAINDROP_ACCESS_TOKEN || '';

    try {
        const raindrops = await getRaindrops(accessToken);
        const trackerJson: TrackerJson[] = raindrops.map(raindropToTrackerJson);
        const jsonString = JSON.stringify(trackerJson);
        await putLatestToS3(jsonString);
        console.log("Successfully uploaded changes to S3");

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: jsonString
        };
    } catch (error) {
        console.error('Error in handler:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to process request' })
        };
    }
};

const getRaindrops = async (accessToken: string): Promise<RaindropItem[]> => {
    const client: RaindropApiClient = createRaindropApiClient(accessToken);
    const collectionId = Number(process.env.RAINDROP_COLLECTION_ID);

    if (!isNaN(collectionId) && collectionId > 0) {
        console.log(`Using cached collection ID: ${collectionId}`);
        return await client.getRaindrops(collectionId);
    }
    
    const targetCollectionTitle = 'tracked-reads';
    console.log(`Fetching collections to find ID for "${targetCollectionTitle}"`);
    const collections = await client.getCollections();
    const targetCollection = collections.find(c => c.title === targetCollectionTitle);
    
    if (!targetCollection) {
        throw new Error(`No collection found with title "${targetCollectionTitle}"`);
    }

    console.log(`Found collection ID: ${targetCollection._id}`);
    return await client.getRaindrops(targetCollection._id);
}

const raindropToTrackerJson = (raindrop: RaindropItem): TrackerJson => {
    return {
        source: raindrop.domain,
        title: raindrop.title,
        url: raindrop.link
    };
};