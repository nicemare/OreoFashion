import request from 'src/utils/request';
import queryString from 'query-string';

/**
 * Fetch category data
 * @returns {*}
 */
export const getCategories = query => request.get(`/wc/v3/products/categories?${queryString.stringify(query, { arrayFormat: 'comma' })}`);
