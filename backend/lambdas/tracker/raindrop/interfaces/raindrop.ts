/**
 * Defines the structure of a reference to a user,
 * associated with a raindrop.
 */
export interface RaindropUserRef {
  /**
   * The type of the referenced collection in the database.
   * @example "users"
   */
  $ref: string;

  /**
   * The unique numeric identifier for the user.
   */
  $id: number;
}

/**
 * Defines a media item associated with a raindrop, like a cover image.
 */
export interface RaindropMediaItem {
  /**
   * The URL of the media asset.
   * @example "https://miro.medium.com/v2/resize:fit:1200/1*2EBxaO0dr4-385jYrWwKPg.jpeg"
   */
  link: string;

  /**
   * The type of the media.
   * @example "image"
   */
  type: string;
}

/**
 * Defines the structure of a reference to the collection
 * that contains the raindrop.
 */
export interface RaindropCollectionRef {
  /**
   * The type of the referenced collection in the database.
   * @example "collections"
   */
  $ref: string;

  /**
   * The unique numeric identifier for the collection.
   */
  $id: number;

  /**
   * The object ID of the collection, often mirroring the $id.
   */
  oid: number;
}

/**
 * Defines the structure for a text highlight made within the raindrop's content.
 */
export interface RaindropHighlight {
  /**
   * The unique string identifier for the highlight.
   */
  _id: string;

  /**
   * The highlighted text content.
   */
  text: string;
  
  /**
   * A user-provided note attached to the highlight.
   */
  note: string;

  /**
   * The color of the highlight.
   */
  color: 'blue' | 'brown' | 'cyan' | 'gray' | 'green' | 'indigo' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow';

  /**
   * The timestamp of when the highlight was created.
   * Stored in ISO 8601 format.
   */
  created: string;
}

/**
 * Defines the structure for the creator of the raindrop.
 */
export interface RaindropCreatorRef {
  /**
   * The unique numeric identifier for the creator.
   */
  _id: number;
  
  /**
   * A URL to the creator's avatar image.
   */
  avatar: string;

  /**
   * The full name or username of the creator.
   * @example "ja23jr"
   */
  name: string;

  /**
   * The email of the creator. This may be empty depending on privacy settings.
   */
  email: string;
}

/**
 * Represents a single Raindrop item (a bookmark) from the Raindrop.io API.
 */
export interface RaindropItem {
  /**
   * The unique numeric identifier for the raindrop.
   * @example 1197823834
   */
  _id: number;

  /**
   * The direct URL of the bookmarked item.
   */
  link: string;

  /**
   * A short summary or description of the content.
   */
  excerpt: string;

  /**
   * A user-provided personal note about the bookmark.
   */
  note: string;

  /**
   * The type of the bookmarked content.
   */
  type: 'article' | 'link' | 'image' | 'video' | 'document' | 'audio';

  /**
   * A reference to the user who owns this raindrop.
   */
  user: RaindropUserRef;

  /**
   * The primary cover image URL for the raindrop.
   */
  cover: string;

  /**
   * An array of media objects associated with the raindrop (e.g., images).
   */
  media: RaindropMediaItem[];

  /**
   * An array of tags assigned to the raindrop.
   */
  tags: string[];

  /**
   * Indicates if the raindrop has been moved to the trash.
   */
  removed: boolean;

  /**
   * A reference to the collection this raindrop belongs to.
   */
  collection: RaindropCollectionRef;

  /**
   * An array of highlight objects made on the article's text.
   */
  highlights: RaindropHighlight[];

  /**
   * The timestamp of when the raindrop was first created.
   * Stored in ISO 8601 format.
   * @example "2025-06-27T02:12:42.978Z"
   */
  created: string;

  /**
   * The timestamp of when the raindrop's properties were last modified.
   * Stored in ISO 8601 format.
   * @example "2025-06-27T02:12:43.551Z"
   */
  lastUpdate: string;

  /**
   * The domain name of the link.
   * @example "chubernetes.com"
   */
  domain: string;

  /**
   * The title of the bookmarked page or item.
   */
  title: string;

  /**
   * A reference to the user who created the raindrop.
   */
  creatorRef: RaindropCreatorRef;
  
  /**
   * A numeric value used for sorting the raindrop within its collection.
   */
  sort: number;

  /**
   * The ID of the collection this raindrop belongs to. Redundant but provided for convenience.
   * @deprecated Use `collection.$id` for consistency.
   */
  collectionId: number;
}

/**
 * Defines the top-level structure of the response from the
 * Raindrop.io `/raindrops/{collectionId}` API endpoint.
 */
export interface RaindropsApiResponse {
  /**
   * Indicates if the API request was successful.
   */
  result: boolean;

  /**
   * An array of raindrop objects.
   */
  items: RaindropItem[];

  /**
   * The total number of items matching the query.
   */
  count: number;

  /**
   * The ID of the collection from which items were fetched.
   */
  collectionId: number;
}