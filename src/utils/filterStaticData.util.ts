interface Option {
  name: string;
  key: number;
}

interface Asset {
  name: Option;
  brand: Option;
  model: Option;
  rfidTag?: boolean;
  qrTag?: boolean;
}

interface Filters {
  search?: string;
  tag?: Array<[boolean, boolean]>;
  name?: number[];
  brand?: number[];
  model?: number[];
}

/**
 * Function to match query with asset properties
 * @param asset - Asset object
 * @param query - Search query
 * @returns boolean - true if query matches any asset property, false otherwise
 */
const matchQuery = (asset: Asset, query: string): boolean => {
  const regQuery = new RegExp(query.trim(), 'i');

  const stringifyValue = (asset: Asset): string => {
    const assetProperties = [
      asset.name.name,
      asset.brand.name,
      asset.model.name,
    ];
    return JSON.stringify(assetProperties);
  };

  return regQuery.test(stringifyValue(asset));
};

/**
 * Function to match tags with asset tags
 * @param asset - Asset object
 * @param tags - Array of tags
 * @returns boolean - true if any tag matches asset tags, false otherwise
 */
const matchTags = (asset: Asset, tags: Array<[boolean, boolean]>): boolean => {
  const assetTags: [boolean, boolean] = [
    Boolean(asset.rfidTag),
    Boolean(asset.qrTag),
  ];

  return tags.some((tag) => tag[0] === assetTags[0] && tag[1] === assetTags[1]);
};

/**
 * Function to match key with asset field key
 * @param asset - Asset object
 * @param keys - Array of keys
 * @param field - Field name
 * @returns boolean - true if any key matches asset field key, false otherwise
 */
const matchKey = (
  asset: Asset,
  keys: number[],
  field: 'name' | 'brand' | 'model'
): boolean => {
  return keys.includes(asset[field].key);
};

/**
 * Function to filter assets based on filters
 * @param assets - Array of Asset objects
 * @param filters - Filters object
 * @returns Array - Filtered array of Asset objects
 */
export const filterAssets = (assets: Asset[], filters: Filters): Asset[] => {
  const matchModes = [
    (asset: Asset) => !filters.search || matchQuery(asset, filters.search),
    (asset: Asset) => !filters.tag || matchTags(asset, filters.tag),
    (asset: Asset) => !filters.name || matchKey(asset, filters.name, 'name'),
    (asset: Asset) => !filters.brand || matchKey(asset, filters.brand, 'brand'),
    (asset: Asset) => !filters.model || matchKey(asset, filters.model, 'model'),
  ];

  return assets.filter((asset: Asset) =>
    matchModes.every((match) => match(asset))
  );
};
