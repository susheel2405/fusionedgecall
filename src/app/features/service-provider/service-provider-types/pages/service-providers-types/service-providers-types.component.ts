import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ServiceProviderTypes } from '../../models/ServiceProviderTypes';
import { ServiceProviderTypesService } from '../../services/serviceProvider-types/service-provider-types.service';
import { ActiveToggleRendererComponent } from '../../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';

@Component({
  selector: 'app-service-providers-types',
  standalone: false,
  templateUrl: './service-providers-types.component.html',
  styleUrl: './service-providers-types.component.css',
})
export class ServiceProvidersTypesComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  rows: ServiceProviderTypes[] = [];
  private gridApi!: GridApi;

  columnDefs: ColDef<ServiceProviderTypes>[] = [
    {
      field: 'ServiceProvideCode',
      headerName: 'Code',
      flex:1,
      minWidth: 90,
      cellStyle: { borderRight: '1px solid #ccc', textAlign: 'center' },
      headerClass: 'bold-header',
    },
    {
      field: 'Description',
      headerName: 'Description',
      flex: 2,
      minWidth: 90,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName:  'Active',
      flex:1,
      minWidth: 90,
      cellRenderer:'activeToggleRenderer',
      cellStyle: {  borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', },
      headerClass: 'bold-header',
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  constructor(private spSvc: ServiceProviderTypesService) {}

  ngOnInit(): void {
    this.spSvc.getAll().subscribe((data) => (this.rows = data));
  }

  onGridReady(e: GridReadyEvent) {
    this.gridApi = e.api;
    this.onFitColumns();
  }

  onFitColumns() {
    this.gridApi?.sizeColumnsToFit();
  }
}
