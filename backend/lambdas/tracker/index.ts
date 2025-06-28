import dotenv from 'dotenv';
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import
import { createRaindropApiClient, RaindropApiClient } from './raindrop/client';
import { RaindropItem } from './raindrop/interfaces/raindrop';

// Load environment variables from .env file
dotenv.config();

const BUCKET_NAME = 'errolmarkland.com';
const KEY_NAME_JSON = "assets/latest.json";
const ACL = 'public-read';
const s3 = new S3Client();

interface TrackerJson {
    source: string,
    title: string,
    url: string
}

async function putLatestToS3(context: Context, jsString: string, key: string) {
    const params = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: jsString,
        ACL
    });
    
    try {
        await s3.send(params);
        console.log(`Upload complete to ${key}`);       
    } catch (err) {
        console.log(`Upload failed to ${key}: ${err}`);
        return;
    }
}

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    // pocket api constants
    const apiKey: string = process.env.ACCESS_TOKEN || '';
    if (!apiKey) {
        console.error('No API key provided');
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'API key is required' })
        };
    }

    try {
        const raindrops = await getRaindrops(apiKey);
        const trackerJson: TrackerJson[] = raindrops.map(raindropToTrackerJson);
        const jsonString = JSON.stringify(trackerJson);
        await putLatestToS3(context, jsonString, KEY_NAME_JSON);
        console.log("Successfully uploaded changes to S3");

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/javascript' },
            body: jsonString
        };
    } catch (error) {
        console.error('Error fetching raindrops:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to fetch raindrops' })
        };
    }
};

const getRaindrops = async (accessToken: string): Promise<RaindropItem[]> => {
    const client: RaindropApiClient = createRaindropApiClient(accessToken);
    const targetCollectionTitle = 'tracked-reads';
    const collections = await client.getCollections();
    const targetCollection = collections.find(c => c.title === targetCollectionTitle);
    
    if (!targetCollection) {
        throw new Error('No collection found with title "tracked-reads"');
    }

    return await client.getRaindrops(targetCollection._id);
}

const raindropToTrackerJson = (raindrop: RaindropItem): TrackerJson => {
    return {
        source: raindrop.domain,
        title: raindrop.title,
        url: raindrop.link
    };
};