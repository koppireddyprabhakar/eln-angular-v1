export const elnEndpointsConfig: EndpointConfig = {
  endpoints: {
    getProducts: '/product/get-products',
    postProduct: '/product/create-product',
    updateProduct: '/product/update-product',
    deleteProduct: '/product/delete-product',
    getDosages: '/dosage/get-dosages',
    postDosage: '/dosage/save-dosage-formulations',
    updateDosage: '/dosage/update-dosage-formulations',
    deleteDosage: '/dosage/delete-dosage',
    getTests: '/lab-test/get-lab-tests',
    createTest: '/lab-test/create-lab-test',
    updateTest: '/lab-test/update-lab-test',
    deleteTest: '/lab-test/delete-lab-test',
  },
};

export interface EndpointConfig {
  endpoints: {
    [key: string]: any;
  };
}
