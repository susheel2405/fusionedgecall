import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SOUTH_AFRICAN_LANGUAGES } from '../../../../../constants/south-african-languages';
import { Call } from '../../../calls/models/Call';
import { CallDataService } from '../../../calls/services/call-data-service/call-data.service';

@Component({
  selector: 'app-call-details',
  standalone: false,
  templateUrl: './call-details.component.html',
  styleUrl: './call-details.component.css',
})
export class CallDetailsComponent implements OnInit {
  languages = SOUTH_AFRICAN_LANGUAGES;
  caseRef!: string;
  callerName: string = '';
  activeTab: string = 'caller'; // default tab
  client: string = '';
  callerForm!: FormGroup;
  caseData: Call | null = null;

  // List of clients for the dropdown
  clients: string[] = ['1Life-Agency1', 'Client B', 'Client C'];
  serviceTypes: string[] = ['AVS-Legal Assist', 'Service Type B', 'Service Type C'];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private callDataService: CallDataService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.caseRef = params.get('callRef') ?? '';
      this.callerName = params.get('callerName') ?? '';
      this.client = params.get('client') ?? '';
    });

    // Initialize the form with a client control
    this.callerForm = this.fb.group({
      client: [this.client || '1Life-Agency1'], // Default to '1Life-Agency1'
      serviceType: ['AVS-Legal Assist'],
      firstName: [''],
      secondName: [''],
      callbackNumber: [''],
      consent: [''],
      isPolicyHolder: [''],
      language: [''],
      refGiven: [''],
    });

    // Optional: use shared data from service
    this.caseData = this.callDataService.getSelectedCall();
  }

  selectTab(tabName: string) {
    this.activeTab = tabName;
  }
}