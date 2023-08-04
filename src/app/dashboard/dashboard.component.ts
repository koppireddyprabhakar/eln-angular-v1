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
  constructor(private dashboardService:DashboardService) {}

  ngOnInit(): void {
    this.getProjectCount();
    this.getFormulationExperimentsCount();
    this.getAnalsysExperimentsCount();
    this.getExperimentsStatusCount();
    this.getTrfStatusCount();
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
    this.pieChart =new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: [
          'Inprogress',
          'Complete',
          'TRF Created',
          'Analysis Submitted',
          'COA Genarated'
        ],
        datasets: [{
          label: 'Experiments',
          data: this.ExperimentsStatusCount,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
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
          label: 'trf ',
          data: this.TrfStatusCount,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      }
    });
  } 
}
