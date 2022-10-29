import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from '@app/shared/services/global/global.service';
import { TeamService } from '@app/shared/services/team/team.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeWhile } from 'rxjs';
import { TeamsList } from './team.interface';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
  teams: TeamsList[] = [];
  selectedTeam: TeamsList = {} as TeamsList;
  subscribeFlag = true;
  teamForm = this.formBuilder.group({
    teamName: ['', [Validators.required]],
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
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.columns = [
      { key: 'teamName', title: 'Team Name' },
      { key: 'insertProcess', title: 'Insert Process' },
      { key: 'status', title: 'Status' },
      {
        key: 'options',
        title: '<div class="blue">Options</div>',
        align: { head: 'center', body: 'center' },
        sorting: false,
        width: 80,
        cellTemplate: this.actionTpl,
      },
    ];
    this.getTeams();
  }

  addTeam() {
    this.selectedTeam = {} as TeamsList;
    this.teamForm.reset();
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
    this.globalService.showLoader();
    const newTeam: { teamName: string | null } = {
      teamName: this.teamForm.get('teamName')!.value,
    };
    if (this.teamForm.get('teamName')!.value) {
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
          teamName: this.teamForm.get('teamName')!.value,
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
    }
  }

  selectTeam(team: TeamsList) {
    this.selectedTeam = team;
    this.teamForm.patchValue({ teamName: team.teamName });
  }

  confirmTeamDeletetion(team: TeamsList) {
    this.selectedTeam = team;
  }

  deleteTeam() {
    this.teamService
      .deleteTeam(this.selectedTeam.teamId)
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
