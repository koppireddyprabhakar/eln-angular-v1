import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ControlPanelService } from '@app/shared/services/control-panel/control-panel.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '@app/shared/services/global/global.service';
import { finalize, takeWhile } from 'rxjs';
import { Superadmin } from './superadmin.interface';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css'],
})
export class SuperadminComponent implements OnInit, OnDestroy {
  @ViewChild('closeButton') closeButton: ElementRef;

  public controlPanelForm: FormGroup;
  public selectedControlPanel: any = {}; 
  private subscribeFlag = true;
  Superadmin: Superadmin[] = [];
 // numberOfUsers: number;


  constructor(
    private readonly controlPanelService: ControlPanelService,
    private readonly formBuilder: FormBuilder,
    private toastr: ToastrService,
    private globalService: GlobalService
  ) {
    this.controlPanelForm = this.formBuilder.group({
      usersLimit: ['', [Validators.required]],
    //  numberOfUsers: ['', [Validators.required]],
      licenceStartDate: ['', [Validators.required]],
      licenceExpiryDate: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getControlPanelData();
 
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }

  
  // Fetch control panel data and bind it to the form
  getControlPanelData() {
    this.globalService.showLoader();
    this.controlPanelService
      .getControlPanel()
      .pipe(
        takeWhile(() => this.subscribeFlag),
        finalize(() => this.globalService.hideLoader())
      )
      .subscribe(
        (data) => {
          this.selectedControlPanel = data;
          this.controlPanelForm.patchValue(data); // Bind the data to the form
        },
        (error) => {
          this.toastr.error('Failed to load control panel data', 'Error');
        }
      );
  }

  // Save form data
  saveControlPanelData() {
    if (this.controlPanelForm.invalid) {
      this.controlPanelForm.markAllAsTouched();
      return;
    }

    const controlPanelData = { ...this.controlPanelForm.value };

    this.globalService.showLoader();
    this.controlPanelService
      .saveControlPanel(controlPanelData)
      .pipe(
        takeWhile(() => this.subscribeFlag),
        finalize(() => this.globalService.hideLoader())
      )
      .subscribe(
        () => {
          this.toastr.success('Control panel data saved successfully', 'Success');
          this.closeButton.nativeElement.click();
        },
        () => {
          this.toastr.error('Failed to save control panel data', 'Error');
        }
      );
  }

}
