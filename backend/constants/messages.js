const ERROR_MESSAGES = {
	INVALID_PRODUCT_ID: 'Invalid product id',
	INVALID_PRODUCT_PAYLOAD: 'Product payload must be a valid object',
	PRODUCT_NOT_FOUND: 'Product not found',
	PRODUCT_CREATE_FAILED: 'Unable to create product',
	PRODUCT_FETCH_FAILED: 'Unable to fetch products',
	PRODUCT_UPDATE_FAILED: 'Unable to update product',
	PRODUCT_DELETE_FAILED: 'Unable to delete product'
};

const SUCCESS_MESSAGES = {
	PRODUCT_CREATED: 'Product added successfully',
	PRODUCT_UPDATED: 'Product updated successfully',
	PRODUCT_DELETED: 'Product deleted successfully'
};

module.exports = {
	ERROR_MESSAGES,
	SUCCESS_MESSAGES
};
