import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import

// Load environment variables from .env file
dotenv.config();

const POCKET_API_URL = 'https://getpocket.com/v3/get';

const BUCKET_NAME = 'errolmarkland.com';
const KEY_NAME_JS = 'js/latest.js';
const KEY_NAME_JSON = "assets/latest.json";
const ACL = 'public-read';
const s3 = new S3Client();

interface PocketJsonResponseInfo {
    domain_metadata: {
        name: string
    },
    resolved_title: string,
    resolved_url: string,
    given_url: string;
}
interface PocketJsonResponse {
    list: {
        [key: string]: PocketJsonResponseInfo
    }
}

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

// helper methods for parsing json payload from pocket
const getSource = (json: PocketJsonResponseInfo): string => {
    if (json.domain_metadata?.name) {
        return json.domain_metadata.name;
    }
    
    // If domain metadata not present, use URL hostname as source
    const urlObject = new URL(json.resolved_url || json.given_url);
    return urlObject.hostname;
};
const getTitle = (json: PocketJsonResponseInfo): string => json.resolved_title;
const getUrl = (json: PocketJsonResponseInfo): string => json.resolved_url;

const normalizePocketJsonResponse = (jsonResponse: PocketJsonResponse): TrackerJson[] => {
    const responseJsonList = jsonResponse.list;
    if (!responseJsonList) return [];
    
    const jsonResults = Object.values(responseJsonList).map(json => ({
        source: getSource(json),
        title: getTitle(json),
        url: getUrl(json)
    }));
    
    return jsonResults.reverse();
};

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    // pocket api constants
    const apiUrl = process.env.POCKET_API_URL || POCKET_API_URL;
    const payload = {
        "consumer_key": process.env.POCKET_CONSUMER_KEY,
        "access_token": process.env.POCKET_ACCESS_TOKEN,
        "tag": "tracker",
        "count": "3",
        "detailType": "simple"
    };
    
    console.log(`API Url is ${apiUrl}`);
    console.log(`Payload is ${JSON.stringify(payload, null, 4)}`);
    // s3 constants
    const { data: resJson } = await axios.post<PocketJsonResponse>(apiUrl, payload, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    console.log('Successfully fetched API response');
    console.log(JSON.stringify(resJson, null, 4));

    console.log('Successfully parsed API response to JSON');
    const normalizedJson = normalizePocketJsonResponse(resJson);
    if (!normalizedJson) {
        return {
            statusCode: 500,
            body: "Failed to parse the normalize the json response from API"
        };
    }
    
    console.log('Successfully normalized API response')
    const jsString = `const latest_json = ${normalizedJson};`;
    await putLatestToS3(context, jsString, KEY_NAME_JS);
    await putLatestToS3(context, JSON.stringify(normalizedJson), KEY_NAME_JSON);
    console.log("Successfully uploaded changes to S3");

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/javascript' },
        body: jsString
    };
};