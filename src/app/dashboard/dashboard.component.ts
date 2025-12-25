import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@app/shared/services/dashboard/dashboard.service';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  lineChart: any = [];
  barChart: any = [];
  analsysBarChart: any = [];
  pieChart: any = [];
  doughnutChart: any = [];
  projectCount: any = [];
  formulationExperimentsCount: any = [];
  ExperimentsStatusCount: any = [];
  TrfStatusCount: any = [];
  analysisexperimentCount: any = [];
  AnalysisExperimentsStatusCount: any;
   pieChartFormulation: any = null;
  pieChartAnalysis: any = null;
  constructor(private dashboardService:DashboardService) {}

  ngOnInit(): void {
    this.getProjectCount();
    this.getFormulationExperimentsCount();
    this.getAnalsysExperimentsCount();
    this.getExperimentsStatusCount();
    this.getTrfStatusCount();
    this.getAnalysisExperimetnStatusCount();
  }

  getProjectCount() {
    this.dashboardService.getProjectsByMonth().subscribe(
      (data) => {
         this.projectCount = data;
         this.createLineChart();
      },
      (error) => {
        console.error('Error:', error);
        this.createLineChart();
      });  
  }

  getFormulationExperimentsCount() {
    this.dashboardService.getExperimentsByMonth().subscribe(
      (data) => {
         this.formulationExperimentsCount = data;
         this.createFormulationBarChart();
      },
      (error) => {
        console.error('Error:', error);
        this.createFormulationBarChart();
      });  
  }

  getExperimentsStatusCount() {
    this.dashboardService.getExperimentStatusByMonth().subscribe(
      (data) => {
         this.ExperimentsStatusCount = data;
         this.createPieChart();
      },
      (error) => {
        console.error('Error:', error);
        this.createPieChart();
      });  
  }

  getTrfStatusCount() {
    this.dashboardService.getTrfStatusByMonth().subscribe(
      (data) => {
         this.TrfStatusCount = data;
         this.createDoughnutChart();
      },
      (error) => {
        console.error('Error:', error);
        this.createDoughnutChart();
      });  
  }

  getAnalsysExperimentsCount() {
    this.dashboardService.getAnalysisexperimentByMonth().subscribe(
      (data) => {
         this.analysisexperimentCount = data;
         this.createAnalsysBarChart();
      },
      (error) => {
        console.error('Error:', error);
        this.createAnalsysBarChart();
      });  
  }

  getAnalysisExperimetnStatusCount(){
    this.dashboardService.getAnalysisExperimentStatusCount().subscribe(
      (data) => {
         this.AnalysisExperimentsStatusCount = data;
         this.AnalysisPieChart();
      },
      (error) => {
        console.error('Error:', error);
        this.AnalysisPieChart();
      });    
  }
  
  createLineChart() {
    this.lineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'],
        datasets: [{
          label: 'Projects',
          data: this.projectCount,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createFormulationBarChart() {
    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'],
        datasets: [{
          label: 'Formulation Experiments',
          data: this.formulationExperimentsCount,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)', // January
            'rgba(255, 159, 64, 0.2)', // February
            'rgba(255, 205, 86, 0.2)', // March
            'rgba(75, 192, 192, 0.2)', // April
            'rgba(54, 162, 235, 0.2)', // May
            'rgba(153, 102, 255, 0.2)', // June
            'rgba(255, 0, 0, 0.2)',     // July
            'rgba(0, 255, 0, 0.2)',     // August
            'rgba(0, 0, 255, 0.2)',     // September
            'rgba(128, 0, 128, 0.2)',   // October
            'rgba(255, 0, 255, 0.2)',   // November
            'rgba(0, 128, 128, 0.2)'    // December
          ],
          borderColor: [
            'rgba(255, 99, 132)', // January
            'rgba(255, 159, 64)', // February
            'rgba(255, 205, 86)', // March
            'rgba(75, 192, 192)', // April
            'rgba(54, 162, 235)', // May
            'rgba(153, 102, 255)', // June
            'rgba(255, 0, 0)',     // July
            'rgba(0, 255, 0)',     // August
            'rgba(0, 0, 255)',     // September
            'rgba(128, 0, 128)',   // October
            'rgba(255, 0, 255)',   // November
            'rgba(0, 128, 128)'    // December
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  createAnalsysBarChart() {
    this.analsysBarChart = new Chart('analsysbarChart', {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'],
        datasets: [{
          label: 'Analysis Experiments',
          data: this.analysisexperimentCount,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)', // January
            'rgba(255, 159, 64, 0.2)', // February
            'rgba(255, 205, 86, 0.2)', // March
            'rgba(75, 192, 192, 0.2)', // April
            'rgba(54, 162, 235, 0.2)', // May
            'rgba(153, 102, 255, 0.2)', // June
            'rgba(255, 0, 0, 0.2)',     // July
            'rgba(0, 255, 0, 0.2)',     // August
            'rgba(0, 0, 255, 0.2)',     // September
            'rgba(128, 0, 128, 0.2)',   // October
            'rgba(255, 0, 255, 0.2)',   // November
            'rgba(0, 128, 128, 0.2)'    // December
          ],
          borderColor: [
            'rgba(255, 99, 132)', // January
            'rgba(255, 159, 64)', // February
            'rgba(255, 205, 86)', // March
            'rgba(75, 192, 192)', // April
            'rgba(54, 162, 235)', // May
            'rgba(153, 102, 255)', // June
            'rgba(255, 0, 0)',     // July
            'rgba(0, 255, 0)',     // August
            'rgba(0, 0, 255)',     // September
            'rgba(128, 0, 128)',   // October
            'rgba(255, 0, 255)',   // November
            'rgba(0, 128, 128)'    // December
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
   createPieChart() {
    if (this.pieChartFormulation instanceof Chart) {
      this.pieChartFormulation.destroy();
    }  
    // Define labels and colors inline
    const statusLabels = [
      'Inprogress', 'Complete', 'Created TRF', 'Analysis Submitted',
      'COA Approved', 'COA Reviewed', 'COA Generated'
    ];
    const backgroundColors = [
      'rgb(12, 23, 12)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)',
      'rgb(75, 192, 192)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
      'rgb(54, 162, 235)'
    ];
 
    // Backend may return data in a different order, so we map it correctly
    const experimentStatusData: { [key: string]: number } = {};
    statusLabels.forEach((label, index) => {
      experimentStatusData[label] = this.ExperimentsStatusCount[index] || 0;
    });
 
    // Filter out zero values
    const filteredData = statusLabels
      .map((label, index) => ({
        label,
        value: experimentStatusData[label],
        color: backgroundColors[index]
      }))
      .filter(item => item.value > 0);
 
    // Extract filtered labels, data, and colors
    const filteredLabels = filteredData.map(item => item.label);
    const filteredValues = filteredData.map(item => item.value);
    const filteredColors = filteredData.map(item => item.color);
    this.pieChartFormulation = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: filteredLabels,
        datasets: [{
          label: 'Experiments',
          data: filteredValues,
          backgroundColor: filteredColors,
          hoverOffset: 4
        }]
      }
    });
  }

   AnalysisPieChart() {
    if (this.pieChartAnalysis instanceof Chart) {
      this.pieChartAnalysis.destroy(); // Destroy only the formulation chart
    }  
    this.pieChartAnalysis = new Chart('AnalysisPieChart', {
      type: 'pie',
      data: {
        labels: [
          'In Progress',
          'Review Completed',
          'Analysis Submitted',
          'COA Generated',
          'COA Reviewed',
          'COA Approved'
        ],
        datasets: [{
          label: 'AnalysisExperiments',
          data: this.AnalysisExperimentsStatusCount,
          backgroundColor: [

            'rgb(255, 99, 132)',   // In Progress
            'rgb(54, 162, 235)',   // Review Completed
            'rgb(75, 192, 192)',   // Analysis Submitted
            'rgb(255, 205, 86)',   // COA Generated
            'rgb(153, 102, 255)',  // COA Reviewed
            'rgb(201, 203, 207)'   // COA Approved
          ],
          hoverOffset: 4
        }]
      }
    });
  }
 
  createDoughnutChart() {
    this.doughnutChart = new Chart('doughnutChart', {
      type: 'doughnut',
      data: {
        labels: [
                  'New',
                   'Inprogress',
                  'Analysis Submitted'
                ],
        datasets: [{
          label: 'TRF Status',
          data: this.TrfStatusCount,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  }
}