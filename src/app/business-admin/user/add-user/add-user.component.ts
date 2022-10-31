import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { GlobalService } from '@app/shared/services/global/global.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  userForm = this.formBuilder.group({
    excipientsName: ['', [Validators.required]],
    materialName: [''],
    materialType: [''],
    batchNumber: [''],
    sourceName: [''],
    potency: [''],
    grade: [''],
  });

  constructor(
    private readonly inwardService: InwardManagementService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}
}
