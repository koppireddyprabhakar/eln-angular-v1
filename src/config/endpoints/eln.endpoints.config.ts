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
    getTestByID: '/lab-test/get-lab-test-by-id',
    createTest: '/lab-test/create-tests',
    updateTest: '/lab-test/update-lab-test',
    deleteTest: '/lab-test/delete-lab-test',
    getTeams: '/teams/get-teams',
    createTeam: '/teams/create-team',
    updateTeam: '/teams/update-team',
    deleteTeam: '/teams/delete-team',
    getUsers: '/usersDetails/get-users-details',
    createUser: '/usersDetails/create-users-details',
    updateUser: '/usersDetails/update-users-details',
    deleteUser: '/usersDetails/delete-users-details',
    getExcipients: 'excipients/get-excipients',
    createExcipient: 'excipients/create-excipient',
    updateExcipient: 'excipients/update-excipient',
    deleteExcipient: 'excipients/delete-excipient',
  },
};

export interface EndpointConfig {
  endpoints: {
    [key: string]: any;
  };
}
