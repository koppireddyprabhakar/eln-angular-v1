import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dosages } from '@app/business-admin/dosage/dosage.interface';
import { Products } from '@app/business-admin/product/product.interface';
import { TeamsList } from '@app/business-admin/team/team.interface';
import { DosageService } from '@app/shared/services/dosage/dosage.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { MarketService } from '@app/shared/services/market/market.service';
import { ProductService } from '@app/shared/services/product/product.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { TeamService } from '@app/shared/services/team/team.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeWhile } from 'rxjs';

@Component({
  selector: 'app-add-project-management',
  templateUrl: './add-project-management.component.html',
  styleUrls: ['./add-project-management.component.css'],
})
export class AddProjectManagementComponent implements OnInit {
  selectedProject: any = {};
  teams: TeamsList[] = [];
  dosages: Dosages[] = [];
  markets: any = [];
  formulations: any = [];
  productCode: string = '';
  productName: string;
  subscribeFlag = true;
  projectId: number;
  productId: number | undefined;
  dosageId: number | undefined;
  formulationId: number | null;
  formulationName: string | null;
  dosageName: string | null;
  teamName: string | null;
  marketName: string | null;
  editForm = false;
  products: Products[] = [];
  projectForm = this.formBuilder.group({
    projectName: ['', [Validators.required]],
    productName: ['' as any, [Validators.required]],
    dosageForm: ['' as any, [Validators.required]],
    strength: ['', [Validators.required]],
    team: ['' as any, [Validators.required]],
    formulationType: ['' as any, [Validators.required]],
    market: ['' as any, [Validators.required]],
    productCode:['' as any],
  });


  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private readonly productService: ProductService,
    private readonly dosageService: DosageService,
    private readonly marketService: MarketService,
    private readonly teamService: TeamService,
    private readonly projectService: ProjectService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private loginService: LoginserviceService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.getDosages();
    this.getMarkets();
    this.getTeams();
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    if (this.projectId) {
      this.getProjectByID();
      this.editForm = true;
    }
  }

  saveProject() {
    let newProject: any = {
      projectName: this.projectForm.get('projectName')?.value,
      productId: this.productId,
      productCode: this.productCode,
      productName: this.productName,
      strength: this.projectForm.get('strength')?.value,
      dosageId: this.dosageId,
      dosageName: this.dosageName,
      formulationId: this.formulationId,
      formulationName: this.formulationName,
      teamId: this.projectForm.get('team')?.value,
      teamName: this.teamName,
      marketId: this.projectForm.get('market')?.value,
      markertName: this.marketName,
      insertUser: this.loginService.userDetails.userId,
      projectTeam: {
        teamId: this.projectForm.get('team')?.value,
      },
    };

    if (!this.projectForm.invalid) {
      this.globalService.showLoader();
      if (Object.keys(this.selectedProject).length === 0) {
        newProject = { ...newProject, status: 'New' };
        this.projectService
          .saveProject(newProject)
          .pipe(
            takeWhile(() => this.subscribeFlag),
            finalize(() => {
              this.globalService.hideLoader();
            })
          )
          .subscribe(() => {
            this.toastr.success(
              'Project has been added succesfully',
              'Success'
            );
            this.route.navigate(['/business-admin/project-management']);
          });
      } else {
        let newProject: any = {
          projectName: this.projectForm.get('projectName')?.value,
          productId: this.productId || this.selectedProject.productId,
          productCode: this.productCode || this.selectedProject.productCode,
          productName: this.productName || this.selectedProject.productName,
          strength: this.projectForm.get('strength')?.value,
          dosageId: this.dosageId || this.selectedProject.dosageId,
          dosageName: this.dosageName || this.selectedProject.dosageName,
          formulationId:
            this.formulationId || this.selectedProject.formulationId,
          formulationName:
            this.formulationName || this.selectedProject.formulationName,
          teamId: this.projectForm.get('team')?.value,
          teamName: this.teamName || this.selectedProject.teamName,
          marketId: this.projectForm.get('market')?.value,
          markertName: this.marketName || this.selectedProject.markertName,
        };
        this.selectedProject = [
          {
            ...this.selectedProject,
            ...newProject,
          },
        ];
        this.projectService
          .updateProject(this.selectedProject[0])
          .pipe(
            takeWhile(() => this.subscribeFlag),
            finalize(() => {
              this.globalService.hideLoader();
            })
          )
          .subscribe(() => {
            this.route.navigate(['/business-admin/project-management/']);
            this.toastr.success(
              'Project has been updated succesfully',
              'Success'
            );
            this.editForm = false;
          });
      }
    } else {
      this.projectForm.get('projectName')?.markAsDirty();
      // this.projectForm.get('status')?.markAsDirty();
      this.projectForm.get('productName')?.markAsDirty();
      this.projectForm.get('dosageForm')?.markAsDirty();
      this.projectForm.get('strength')?.markAsDirty();
      this.projectForm.get('formulationType')?.markAsDirty();
      this.projectForm.get('market')?.markAsDirty();
      this.projectForm.get('team')?.markAsDirty();
    }
  }

  redirectToUsers() {
    this.route.navigate(['/business-admin/project-management/']);
  }

  getProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }
  getMarkets() {
    this.marketService.getMarkets().subscribe((markets) => {
      this.markets = markets;
    });
  }

  getDosages() {
    this.dosageService.getDosages().subscribe((dosages) => {
      this.dosages = dosages;
    });
  }

  getTeams() {
    this.projectService.getProjectsTeams().subscribe((teams) => {
      this.teams = teams;
    });
  }

  productChange() {
    const product: any = this.products.filter(
      (prod) => prod.productId === this.projectForm.get('productName')?.value
    )[0];
    this.productId = product.productId;
    this.productCode = product.productCode;
    this.productName = product.productName;
  }
  teamChange() {
    const team: any = this.teams.filter(
      (team) => team.teamId === this.projectForm.get('team')?.value
    )[0];
    this.teamName = team.teamName;
  }
  marketChange() {
    const market: any = this.markets.filter(
      (market) => market.marketId === this.projectForm.get('market')?.value
    )[0];
    this.marketName = market.marketName;
  }

  formulationChange() {
    const formulation: any = this.formulations.filter(
      (formulae) =>
        formulae.formulationId ===
        this.projectForm.get('formulationType')?.value
    )[0];
    this.formulationId = formulation.formulationId;
    this.formulationName = formulation.formulationName;
  }

  dosageChange() {
    const dosage = this.dosages.filter(
      (dosage) => dosage.dosageId === this.projectForm.get('dosageForm')?.value
    )[0];
    this.dosageId = dosage?.dosageId;
    this.dosageName = dosage?.dosageName;
    this.formulations = this.dosages.filter(
      (dosage) => dosage.dosageId === this.dosageId
    )[0].formulations;

    this.projectForm.get('formulationType')?.setValue(null);
    this.projectForm.get('formulationType')?.updateValueAndValidity();
  }

  getProjectByID() {
    this.globalService.showLoader();
    this.projectService
      .getProjectById(this.projectId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((selectedProject) => {
        this.globalService.hideLoader();

        setTimeout(() => {
          // <<<---using ()=> syntax
          this.formulations = this.dosages.filter(
            (dosage) => dosage.dosageId === selectedProject.dosageId
          )[0].formulations;
          this.selectedProject = selectedProject;       
          this.projectForm.patchValue({
            projectName: selectedProject.projectName,
            productName: selectedProject.productId,
            dosageForm: selectedProject.dosageId,           
            strength: selectedProject.strength,
            team: selectedProject.teamId,
            formulationType: selectedProject.formulationId,
            market: selectedProject.marketId,
            productCode:selectedProject.productCode,
          });
        }, 2000);
      });
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
