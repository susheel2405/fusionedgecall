import { Component } from '@angular/core';
import { ServiceProviders } from '../../models/ServiceProviders';
import { ServicProvidersService } from '../../services/service-providers/servic-providers.service';
import { ColDef, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-service-providers',
  standalone: false,
  templateUrl: './service-providers.component.html',
  styleUrl: './service-providers.component.css',
})
export class ServiceProvidersComponent {
  serviceProviders: ServiceProviders[] = [];
  gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: 'Name', headerName: 'Name', minWidth: 150 },
    { field: 'VATNumber', headerName: 'VAT Number', minWidth: 150 },
    { field: 'CompanyRegNo', headerName: 'Company Reg. No', minWidth: 160 },
    { field: 'Branch', headerName: 'Branch', minWidth: 120 },
    {
      field: 'OfficeAddress',
      headerName: 'Office Address',
      minWidth: 250,
      wrapText: true,
      autoHeight: true,
    },
    {
      field: 'StorageAddress',
      headerName: 'Storage Address',
      minWidth: 250,
      wrapText: true,
      autoHeight: true,
    },
    { field: 'TownCity', headerName: 'Town / City', minWidth: 130 },
    { field: 'Province', headerName: 'Province', minWidth: 130 },
    {
      field: 'ServiceProviderServiceTypeId',
      headerName: 'Service Type ID',
      minWidth: 140,
    },
    { field: 'DesignationNumber', headerName: 'Designation No', minWidth: 140 },
    { field: 'Manager', headerName: 'Manager', minWidth: 130 },
    { field: 'RatePerKm', headerName: 'Rate per Km', minWidth: 120 },
    {
      field: 'RateAuthorisedOn',
      headerName: 'Rate Authorised On',
      minWidth: 160,
    },
    {
      field: 'RateAuthorisedby',
      headerName: 'Rate Authorised By',
      minWidth: 150,
    },
    { field: 'IsActive', headerName: 'Active', minWidth: 100 },
    { field: 'IsActiveOn', headerName: 'Active On', minWidth: 150 },
    { field: 'IsActiveby', headerName: 'Active By', minWidth: 150 },
    { field: 'IsVerified', headerName: 'Verified', minWidth: 100 },
    { field: 'IsVerifiedOn', headerName: 'Verified On', minWidth: 150 },
    { field: 'IsVerifiedby', headerName: 'Verified By', minWidth: 150 },
    {
      field: 'IsAccredited',
      headerName: 'Accredited',
      minWidth: 120,
      cellRenderer: (params: any) => {
        const icon = params.value ? 'tick' : 'cross';
        return `<img src="assets/icons/${icon}.png" alt="${
          params.value ? 'Yes' : 'No'
        }" style="width: 20px; height: 20px;" />`;
      },
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    { field: 'IsAccreditedOn', headerName: 'Accredited On', minWidth: 150 },
    { field: 'IsAccreditedby', headerName: 'Accredited By', minWidth: 150 },
    {
      field: 'ContactDetails',
      headerName: 'Contact Details',
      valueGetter: (params) =>
        params.data?.ContactDetails?.map(
          (c: any) => `${c.Type}: ${c.Value}`
        ).join(', '),
      autoHeight: true,
      wrapText: true,
      minWidth: 250,
    },
  ];

  defaultColDef: ColDef = {
    headerClass: 'bold-header',
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: {
      borderRight: '1px solid #ccc',
    },
  };

  constructor(private providerService: ServicProvidersService) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.providerService.getServiceProviders().subscribe((data) => {
      this.serviceProviders = data;
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;

    // Optional: Only auto-size some columns (e.g., short ones)
    const autoSizeThese = [
      'Name',
      'VATNumber',
      'Branch',
      'Manager',
      'Province',
    ];
    setTimeout(() => {
      const colIds =
        this.gridApi
          .getColumnDefs()
          ?.map((col: any) => col.field)
          .filter((id: string) => autoSizeThese.includes(id)) || [];
      this.gridApi.autoSizeColumns(colIds);
    }, 100);
  }

  resetColumns(): void {
    this.gridApi.setGridOption('columnDefs', this.columnDefs);
  }
}
