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
    getUserByID: '/usersDetails/get-users-details-by-id',
    deleteUser: '/usersDetails/delete-users-details',
    getExcipients: 'excipients/get-excipients',
    createExcipient: 'excipients/create-excipient',
    updateExcipient: 'excipients/update-excipient',
    deleteExcipient: 'excipients/delete-excipient',
    getDepartments: 'department/get-departments',
    getUserRoles: 'userrole/get-user-roles',
    createProject: 'project/create-project',
    updateProject: 'project/update-project',
    deleteProject: 'project/delete-project',
    getProjects: 'project/get-projects',
    getProjectById: 'project/get-project-by-id',
    getProjectsTeams: 'project/get-formulations-teams',
    getProjectsTeamsId:
      'formulation/get-projects-by-dosage-or-team-id?teamId=5',
    getMarkets: 'market/get-markets',
  },
};

export interface EndpointConfig {
  endpoints: {
    [key: string]: any;
  };
}
