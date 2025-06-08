import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicProvidersService } from '../../services/service-providers/servic-providers.service';
import { ServiceProviders, ContactDetail } from '../../models/ServiceProviders';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-service-providers-popup',
  standalone: false,
  templateUrl: './service-providers-popup.component.html',
  styleUrls: ['./service-providers-popup.component.css'],
})
export class ServiceProvidersPopupComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();

  providerForm!: FormGroup;

  constructor(private fb: FormBuilder, private service: ServicProvidersService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.providerForm = this.fb.group({
      name: ['', Validators.required],
      vatNumber: [''],
      companyRegNo: [''],
      branch: [''],
      officeAddress: [''],
      storageAddress: [''],
      townCity: [''],
      province: [''],

      contactNumbers: this.fb.array([this.createContactRow()]),
      faxNumbers: this.fb.array([this.createFaxRow()]),
      emailAddresses: this.fb.array([this.createEmailRow()]),

      serviceType: [''],
      designationNo: [''],

      ratePerKm: [''],
      dateAuthorised: [''],
      authorisedBy: [''],

      canEditAddress: [false],
      isActive: [false],
      dateOpened: [''],
      openedBy: [''],

      isVerified: [false],
      dateVerified: [''],
      verifiedBy: [''],

      isAccredited: [false],
      dateAccredited: [''],
      accreditedBy: [''],
    });
  }

  get contactNumbers(): FormArray {
    return this.providerForm.get('contactNumbers') as FormArray;
  }

  get faxNumbers(): FormArray {
    return this.providerForm.get('faxNumbers') as FormArray;
  }

  get emailAddresses(): FormArray {
    return this.providerForm.get('emailAddresses') as FormArray;
  }

  private createContactRow(): FormGroup {
    return this.fb.group({
      number: [''],
      name: [''],
      comment: [''],
    });
  }

  private createFaxRow(): FormGroup {
    return this.fb.group({
      fax: [''],
      name: [''],
      comment: [''],
    });
  }

  private createEmailRow(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      type: [''],
    });
  }

  addContactRow(): void {
    if (this.contactNumbers.length < 5) {
      this.contactNumbers.push(this.createContactRow());
    }
  }

  removeContactRow(index: number): void {
    if (this.contactNumbers.length > 1) {
      this.contactNumbers.removeAt(index);
    }
  }

  addFaxRow(): void {
    if (this.faxNumbers.length < 3) {
      this.faxNumbers.push(this.createFaxRow());
    }
  }

  removeFaxRow(index: number): void {
    if (this.faxNumbers.length > 1) {
      this.faxNumbers.removeAt(index);
    }
  }

  addEmailRow(): void {
    if (this.emailAddresses.length < 2) {
      this.emailAddresses.push(this.createEmailRow());
    }
  }

  removeEmailRow(index: number): void {
    if (this.emailAddresses.length > 1) {
      this.emailAddresses.removeAt(index);
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onCancel(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.providerForm.valid) {
      const formValue = this.providerForm.value;

      const payload: ServiceProviders = {
        ServiceProviderId: 0,
        Name: formValue.name,
        VATNumber: formValue.vatNumber,
        CompanyRegNo: formValue.companyRegNo,
        Branch: formValue.branch,
        OfficeAddress: formValue.officeAddress,
        StorageAddress: formValue.storageAddress,
        TownCity: formValue.townCity,
        Province: formValue.province,
        ServiceProviderServiceTypeId: this.mapServiceType(formValue.serviceType),
        DesignationNumber: formValue.designationNo,
        Manager: '',
        RatePerKm: +formValue.ratePerKm || 0,
        RateAuthorisedOn: formValue.dateAuthorised,
        RateAuthorisedby: formValue.authorisedBy,
        IsActive: formValue.isActive,
        IsActiveOn: formValue.dateOpened,
        IsActiveby: formValue.openedBy,
        IsVerified: formValue.isVerified,
        IsVerifiedOn: formValue.dateVerified,
        IsVerifiedby: formValue.verifiedBy,
        IsAccredited: formValue.isAccredited,
        IsAccreditedOn: formValue.dateAccredited,
        IsAccreditedby: formValue.accreditedBy,
        ContactDetails: this.mapContactDetails(
          formValue.contactNumbers,
          formValue.faxNumbers,
          formValue.emailAddresses
        )
      };

      this.service.addServiceProvider(payload).subscribe({
        next: () => {
          this.toastr.success('Service provider added successfully!', 'Success');
          this.formSubmit.emit(payload);
          this.close.emit();
        },
        error: (err) => {
          this.toastr.error('Failed to add service provider', err);
          console.error('Failed to add service provider', err);
        }
      });
    } else {
      this.providerForm.markAllAsTouched();
      this.toastr.error('Please fill in all required fields.', 'Form Incomplete')
    }
  }

  private mapServiceType(type: string): number {
    switch (type) {
      case 'Internet': return 1;
      case 'TV': return 2;
      case 'Phone': return 3;
      case 'Hosting': return 4;
      default: return 0;
    }
  }

  private mapContactDetails(
    contacts: any[],
    faxes: any[],
    emails: any[]
  ): ContactDetail[] {
    const contactList: ContactDetail[] = [];

    contacts.forEach(c => {
      contactList.push({
        Id: 0,
        Type: 'Phone',
        Code: '+27',
        Value: c.number,
        Name: c.name,
        Comments: c.comment
      });
    });

    faxes.forEach(f => {
      contactList.push({
        Id: 0,
        Type: 'Fax',
        Code: '',
        Value: f.fax,
        Name: f.name,
        Comments: f.comment
      });
    });

    emails.forEach(e => {
      contactList.push({
        Id: 0,
        Type: e.type || 'Email',
        Code: '',
        Value: e.email,
        Name: '',
        Comments: ''
      });
    });

    return contactList;
  }
}
