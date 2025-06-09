import { Component, OnInit } from '@angular/core';
import { AreaCodes } from '../../models/AreaCodes';
import { AreaCodesService } from '../../services/areacodes/area-codes.service';
import {
  CellValueChangedEvent,
  ColDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GridApi,
} from 'ag-grid-community';
import {
  AddAreaCodeRowLocally,
  LoadAreaCodes,
  DeleteAreaCode,
  UpdateAreaCode,
} from '../../state/area-code.actions';
import { Store } from '@ngxs/store';
import { AreaCodesState } from '../../state/area-code.state';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';

@Component({
  selector: 'app-area-codes',
  standalone: false,
  templateUrl: './area-codes.component.html',
  styleUrl: './area-codes.component.css',
})
export class AreaCodesComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  gridApi!: GridApi;

  rowData: AreaCodes[] = [];

  columnDefs: ColDef<AreaCodes>[] = [
    {
      field: 'AreaCode',
      headerName: 'Code',
      sortable: true,
      flex: 1,
      maxWidth: 150,
      editable: true,
      cellEditor: 'agTextCellEditor',
      valueFormatter: (params) =>
        params.value ? params.value : 'Enter Areacode',
      cellClassRules: {
        'hint-text': (params) => !params.value,
      },
      cellStyle: { borderRight: '1px solid #ccc', textAlign: 'center' },
      headerClass: 'bold-header',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'Description',
      headerName: 'Description',
      sortable: true,
      flex: 2,
      minWidth: 200,
      editable: true,
      cellEditor: 'agTextCellEditor',
      valueFormatter: (params) =>
        params.value ? params.value : 'Enter Country/Region',
      cellClassRules: {
        'hint-text': (params) => !params.value,
      },
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'Type',
      headerName: 'Type',
      sortable: true,
      flex: 1,
      minWidth: 180,
      editable: true,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: ['Landline', 'Mobile', 'International'],
      },
      valueFormatter: (params) => (params.value ? params.value : 'Select Type'),
      cellClassRules: {
        'hint-text': (params) => !params.value,
      },
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      flex: 1,
      minWidth: 120,
      cellRenderer: 'activeToggleRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Delete',
      flex: 1,
      minWidth: 100,
      cellRenderer: 'softDeleteRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
      filter: 'agTextColumnFilter',
      onCellClicked: (params: any) => this.deleteAreaCode(params.data),
    },
    {
      headerName: 'Save',
      flex: 1,
      minWidth: 120,
      cellRenderer: (params: any) => {
        const isNew = !params.data.AreaCodeId;
        const isEdited = params.data.isEdited === true;
        const disabled = !(isNew || isEdited);
        const disabledAttr = disabled ? 'disabled' : '';

        return `
          <button
            ${disabledAttr}
            style="
              background-color: ${disabled ? '#ccc' : '#05b9bc'};
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: 500;
              height: 42px;
              display: flex;
              align-items: center;
              padding: 0 14px;
              font-size: 1rem;
              justify-content: center;
              cursor: ${disabled ? 'not-allowed' : 'pointer'};
            "
          >
            Save
          </button>
        `;
      },
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
      onCellClicked: (params: any) => {
        const data = params.data;
        const isNew = !data.AreaCodeId;
        const isEdited = data.isEdited === true;

        if (isNew || isEdited) {
          this.saveRow(data);
        }
      },
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  constructor(
    private store: Store,
    private areaCodesService: AreaCodesService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadAreaCodes());
    this.store.select(AreaCodesState.getAreaCodes).subscribe((data) => {
      console.log('From select:', data);
      this.rowData = data;
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    const row = event.data;
    const isNew = !row.AreaCodeId;

    row.isEdited = true;
    this.gridApi.applyTransaction({ update: [row] });
  }

  saveRow(row: AreaCodes): void {
    const isComplete =
      row.AreaCode &&
      row.Description &&
      row.Type !== undefined &&
      row.Type !== null &&
      row.IsActive !== null &&
      row.IsActive !== undefined;

    if (isComplete) {
      this.areaCodesService.addAreaCode(row).subscribe(
        () => {
          alert('Saved successfully!');
          row.isEdited = false;
          this.gridApi.applyTransaction({ update: [row] });
          this.store.dispatch(new LoadAreaCodes());
        },
        (error) => {
          console.error('Error saving area code:', error);
          alert(`Error saving area code: ${error.statusText || error.message}`);
        }
      );
    } else {
      alert('Please complete all required fields before saving.');
    }
  }

  getRowClass = (params: any) => {
    return !params.data.AreaCodeId ? 'temporary-row' : '';
  };

  deleteAreaCode(areaCode: AreaCodes): void {
    if (confirm('Are you sure you want to permanently delete this area code?')) {
      if (!areaCode.AreaCodeId) {
        console.log('Deleting temporary row:', areaCode);
        const updatedState = this.rowData.filter((row) => row !== areaCode);
        this.gridApi.applyTransaction({ remove: [areaCode] });
        this.store.dispatch(new LoadAreaCodes());
        alert('Temporary row deleted successfully!');
        return;
      }

      console.log('Deleting area code with ID:', areaCode.AreaCodeId);
      this.store.dispatch(new DeleteAreaCode(areaCode)).subscribe({
        next: () => {
          alert('Area code deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting area code:', error);
          const errorMessage = error.statusText || error.message || 'Unknown error';
          alert(`Error deleting area code: ${errorMessage}. Check the console for more details.`);
        },
      });
    }
  }

  addRow(): void {
    const newRow: AreaCodes = {
      AreaCode: '',
      Description: '',
      Type: 'Landline',
      IsActive: true,
    };
    this.store.dispatch(new AddAreaCodeRowLocally(newRow));
  }

  getContextMenuItems: GetContextMenuItems = (
    params: GetContextMenuItemsParams
  ) => {
    const addRow = {
      name: 'Add Row',
      action: () => this.addRow(),
      icon: '<i class="fas fa-plus"></i>',
    };

    const deleteRow = {
      name: 'Delete Row',
      action: () => {
        if (params.node) {
          this.deleteAreaCode(params.node.data);
        }
      },
      icon: '<i class="fas fa-trash"></i>',
    };

    return [addRow, deleteRow, 'separator', 'copy', 'export'];
  };
}