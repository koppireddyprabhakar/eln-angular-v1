export const elnEndpointsConfig: EndpointConfig = {
  endpoints: {
    getProducts: '/product/get-products',
    postProduct: '/product/create-product',
    updateProduct: '/product/update-product',
    deleteProduct: '/product/delete-product',
    getDosages: '/dosage/get-dosages',
    postDosage: '/dosage/create-dosage',
    updateDosage: '/dosage/update-dosage',
    deleteDosage: '/dosage/delete-dosage',
  },
};

export interface EndpointConfig {
  endpoints: {
    [key: string]: any;
  };
}
