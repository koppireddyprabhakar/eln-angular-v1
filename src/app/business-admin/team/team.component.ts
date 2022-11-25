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
import { finalize, takeWhile } from 'rxjs';
import { Dosages } from '../dosage/dosage.interface';
import { Departments } from '../user/user.interface';
import { TeamsList } from './team.interface';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
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
  columns: any;
  options: any = {};

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor(
    private readonly teamService: TeamService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private readonly departmentService: DepartmentService,
    private readonly dosageService: DosageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.columns = [
      { key: 'teamName', title: 'Team Name' },
      { key: 'departmentName', title: 'Department Name' },
      { key: 'dosageName', title: 'Dosage Name' },
      { key: 'insertProcess', title: 'Insert Process' },
      { key: 'status', title: 'Status' },
      {
        key: 'options',
        title: '<div class="blue">Options</div>',
        align: { head: 'center', body: 'center' },
        sorting: false,
        width: 150,
        cellTemplate: this.actionTpl,
      },
    ];
    this.getTeams();
    this.getDepartments();
    this.getDosages();
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
          status: 'Active',
        }));
        this.teams = newTeamsList;
        this.globalService.hideLoader();
      });
  }

  saveTeam() {
    const newTeam = {
      teamName: this.teamForm.get('teamName')!.value,
      deptId: this.teamForm.get('deptId')!.value,
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
      this.globalService.showLoader();
      if (Object.keys(this.selectedTeam).length === 0) {
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
    console.log(this.selectedTeam);
    this.teamForm.patchValue({
      teamName: team.teamName,
      deptId: team.deptId,
      dosageId: team.dosageId,
    });
  }

  confirmTeamDeletetion(team: TeamsList) {
    this.selectedTeam = team;
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
}
