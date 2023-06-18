import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DepartmentService } from '@app/shared/services/department/department.service';
import { DosageService } from '@app/shared/services/dosage/dosage.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { TeamService } from '@app/shared/services/team/team.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, finalize, takeWhile } from 'rxjs';
import { Dosages } from '../dosage/dosage.interface';
import { Departments } from '../user/user.interface';
import { TeamsList } from './team.interface';
import { DataTableDirective } from 'angular-datatables';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  teams: TeamsList[] = [];
  dosages: Dosages[] = [];
  departmentList: Departments[] = [];
  selectedTeam: any = {};
  subscribeFlag = true;
  teamForm = this.formBuilder.group({
    teamName: ['', [Validators.required]],
    deptId: [null, [Validators.required]],
    dosageId: [null, [Validators.required]],
  });
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;

  constructor(
    private readonly teamService: TeamService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private readonly departmentService: DepartmentService,
    private readonly dosageService: DosageService,
    private toastr: ToastrService,
    private loginService: LoginserviceService) { }

  ngOnInit(): void {
    this.getTeams();
    this.getDepartments();
    this.getDosages();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  addTeam() {
    this.selectedTeam = {} as TeamsList;
    this.teamForm.reset();
  }

  getDepartments() {
    this.departmentService.getDepartments().subscribe((department) => {
      this.departmentList = department;
    });
  }

  getDosages() {
    this.dosageService
      .getDosages()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((dosages) => {
        const newDosagesList = dosages.map((dosage: any) => ({
          ...dosage,
          formulationsList: dosage.formulations.map(
            (dosage) => dosage.formulationName
          ),
        }));
        this.dosages = newDosagesList;
      });
  }

  getTeams() {
    this.globalService.showLoader();
    this.teamService
      .getTeams()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((teams) => {
        const newTeamsList = teams.map((team: any) => ({
          ...team,
          //  status: '',
        }));
        this.teams = newTeamsList;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.teams);
        });
        this.globalService.hideLoader();
      });
  }

  saveTeam() {
    const newTeam = {
      teamName: this.teamForm.get('teamName')!.value,
      deptId: this.teamForm.get('deptId')!.value,
      insertUser: this.loginService.userDetails.userId,

      teamDosages: [
        {
          teamId:
            Object.keys(this.selectedTeam).length === 0
              ? 0
              : this.selectedTeam.teamId,
          dosageId: this.teamForm.get('dosageId')!.value,
        },
      ],
    };
    if (!this.teamForm.invalid) {
      if (Object.keys(this.selectedTeam).length === 0) {

        if (this.isTeamExist(newTeam)) {
          return;
        }
        this.globalService.showLoader();
        this.teamService
          .saveTeam(newTeam)
          .pipe(
            takeWhile(() => this.subscribeFlag),
            finalize(() => {
              this.globalService.hideLoader();
            })
          )
          .subscribe(() => {
            this.getTeams();
            this.closeButton.nativeElement.click();
            this.toastr.success('Team has been added succesfully', 'Success');
          });
      } else {
        this.selectedTeam = {
          ...this.selectedTeam,
          ...newTeam,
        };
        this.teamService
          .updateTeam(this.selectedTeam)
          .pipe(
            finalize(() => {
              this.globalService.hideLoader();
            })
          )
          .subscribe(() => {
            this.getTeams();
            this.closeButton.nativeElement.click();
            this.toastr.success('Team has been updated succesfully', 'Success');
          });
      }
    } else {
      this.teamForm.get('teamName')?.markAsDirty();
      this.teamForm.get('dosageId')?.markAsDirty();
      this.teamForm.get('deptId')?.markAsDirty();
    }
  }

  selectTeam(team) {
    this.selectedTeam = team;
    this.teamForm.patchValue({
      teamName: team.teamName,
      deptId: team.deptId,
      dosageId: team.dosageId,
    });
  }

  confirmTeamDeletetion(team: TeamsList) {
    this.selectedTeam = {
      status: 'string',
      teamId: team.teamId,
      teamName: team.teamName,
      deptId: team.deptId,
      teamDosages: [
        {
          status: 'string',
          teamId: team.teamId,
          dosageId: team.dosageId,
        },
      ],
    };
  }

  deleteTeam() {
    this.selectedTeam = { ...this.selectedTeam, status: 'Inactive' };
    this.teamService
      .deleteTeam(this.selectedTeam)
      .pipe(
        takeWhile(() => this.subscribeFlag),
        finalize(() => {
          this.globalService.hideLoader();
        })
      )
      .subscribe(() => {
        this.getTeams();
        this.closeDeleteButton.nativeElement.click();
        this.toastr.success('Team has been deleted succesfully', 'Success');
      });
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }

  isTeamExist(newTeam) {

    for (let i = 0; i < this.teams.length; i++) {
      if (this.teams[i].teamName === newTeam.teamName) {
        this.toastr.error('Same name -' + newTeam.teamName + '- already exist.', 'Error');
        return true;
      }
    }

    return false;
  }

}
