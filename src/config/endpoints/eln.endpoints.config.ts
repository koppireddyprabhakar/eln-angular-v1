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
      'formulation-dashboard/get-projects-by-dosage-or-team-id?teamId=10',
    createFormulationProject: 'formulation-dashboard/create-project',
    updateFormulationProject: 'formulation-dashboard/update-project',
    deleteFormulationProject: 'formulation-dashboard/delete-project',
    getFormulationProjects: 'formulation-dashboard/get-projects',
    getFormulationBatchNumber: 'formulation-dashboard/get-batch-number',
    getFormulationProjectById: 'formulation-dashboard/get-project-by-id',
    getFormulationProjectsTeams: 'formulation-dashboard/get-formulations-teams',
    getFormualtionDashboardExperiments: 'formulation-dashboard/get-experiments',
    getFormulationProjectsTeamsId:
      'formulation-dashboard/get-projects-by-dosage-or-team-id?teamId=10',
    getMarkets: 'market/get-markets',
    getExperiments: 'experiment/get-experiments',
    createExperiment: 'experiment/create-experiment',
    // createExperiment: 'experiment/create-experiment-attachment',
    saveExcipient: 'experiment/save-excipient',
    saveExperimentDetails: 'experiment/save-experiment-details',
    updateExperimentDetails: 'experiment/update-experiment-details',
    saveExperimentAttachment: 'experiment/save-experiment-attachment',
    getExperimentsById:
      'formulation-dashboard/get-experiments-by-user-id?userId=3',
    getExperimentById: 'experiment/get-experiment-by-id',
    getExperimentDetailsById: 'experiment/get-experiment-details-by-id',
    getFormulationsExperimentById: 'formulation-dashboard/get-experiment-by-id',
    createTestRequestForm: 'test-request-form/create-test-request-form',
    updateTestRequestForm: 'test-request-form/update-test-request-form',
    getTestRequestForm: 'test-request-form/get-test-request-forms',
    getExperimentAttachmentContent:
      'experiment/get-experiment-attachment-content',
    getExperimentAttachmentById: 'experiment/search-experiment-attachments',
    deleteExperimentAttachment: 'experiment/delete-experiment-attachment',
    saveTrf: 'test-request-form/create-test-request-form',
    getAnalysisList: 'analysis/get-analysis-list',
    getAnalysisListByTeamId: 'analysis/get-analysis-by-team-id',
    getAnalysisById: 'analysis/get-analysis-by-id',
    saveAnalysisDetails: 'analysis/save-analysis-details',
    saveAnalysisExcipient: 'analysis/save-analysis-excipient',
    searchAnalysisAttachments: 'analysis/search-analysis-attachments',
    saveAnalysisAttachments: 'analysis/save-analysis-attachment',
  },
};

export interface EndpointConfig {
  endpoints: {
    [key: string]: any;
  };
}
