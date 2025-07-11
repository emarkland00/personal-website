/** This was AI generated using google gemini */


/**
 * Defines the structure of a reference to a user,
 * commonly used within collection data.
 */
export interface CollectionUserRef {
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
 * Defines the structure for the creator of the collection.
 */
export interface CollectionCreatorRef {
  /**
   * The unique numeric identifier for the creator.
   */
  _id: number;

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
 * Defines the structure for a parent collection reference.
 */
export interface CollectionParentRef {
  /**
   * The type of the referenced collection in the database.
   * @example "collections"
   */
  $ref: string;

  /**
   * The unique numeric identifier for the parent collection.
   */
  $id: number;
}


/**
 * Describes the access rights the authenticated user has for this collection.
 */
export interface CollectionAccess {
  /**
   * The user ID to whom this access level applies.
   */
  for: number;

  /**
   * The permission level.
   * (e.g., 4 might indicate owner/full access).
   */
  level: number;

  /**
   * Indicates if this is a root-level collection for the user.
   */
  root: boolean;

  /**
   * Specifies if the collection can be dragged/re-ordered in the UI.
   */
  draggable: boolean;
}

/**
 * Represents a single Collection item from the Raindrop.io API.
 */
export interface CollectionItem {
  /**
   * The unique numeric identifier for the collection.
   * @example 56968410
   */
  _id: number;

  /**
   * The user-defined name of the collection.
   * @example "tracked-reads"
   */
  title: string;

  /**
   * An optional user-provided description of the collection.
   */
  description: string;

  /**
   * A reference to the user who owns this collection.
   */
  user: CollectionUserRef;

  /**
   * When true, the collection is accessible to anyone with the public link.
   */
  public: boolean;

  /**
   * The total number of bookmarks ('raindrops') inside this collection.
   */
  count: number;

  /**
   * An array of URLs for cover images. Typically empty or contains a single URL.
   */
  cover: string[];

  /**
   * A numeric value used to determine the collection's position in a sorted list.
   */
  sort: number;

  /**
   * When true, the collection is shown as expanded in the UI, revealing any sub-collections.
   */
  expanded: boolean;

  /**
   * A reference to the user who created the collection.
   */
  creatorRef: CollectionCreatorRef;

  /**
   * The timestamp of the last action performed on the collection (e.g., adding a bookmark).
   * Stored in ISO 8601 format.
   * @example "2025-06-27T02:12:43.578Z"
   */
  lastAction: string;

  /**
   * The timestamp of when the collection was first created.
   * Stored in ISO 8601 format.
   * @example "2025-06-27T02:12:17.821Z"
   */
  created: string;

  /**
   * The timestamp of when the collection's properties were last modified.
   * Stored in ISO 8601 format.
   * @example "2025-06-27T02:15:27.812Z"
   */
  lastUpdate: string;

  /**
   * A reference to the parent collection if this is a sub-collection.
   * It is `null` for top-level (root) collections.
   */
  parent: CollectionParentRef | null;

  /**
   * A URL-friendly version of the collection title.
   * @example "tracked-reads"
   */
  slug: string;

  /**
   * The default view style for items within this collection in the Raindrop.io UI.
   * @example "list"
   */
  view: 'list' | 'simple' | 'grid' | 'masonry';

  /**
   * An object detailing the authenticated user's access permissions for this collection.
   */
  access: CollectionAccess;

  /**
   * When true, indicates that the authenticated user is the author of this collection.
   */
  author: boolean;
}

/**
 * Defines the top-level structure of the response from the
 * Raindrop.io `/collections` API endpoint.
 */
export interface CollectionsApiResponse {
  /**
   * Indicates if the API request was successful.
   */
  result: boolean;

  /**
   * An array of collection objects.
   */
  items: CollectionItem[];

  /**
   * An error message if the request was not successful.
   */
  errorMessage?: string;
}

