import { Component, OnInit } from '@angular/core';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { AreaCodes } from '../../models/AreaCodes';
import { AreaCodesService } from '../../services/areacodes/area-codes.service';
import {
  CellValueChangedEvent,
  ColDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GridApi,
  ICellRendererParams,
} from 'ag-grid-community';
import {
  AddAreaCodeRowLocally,
  LoadAreaCodes,
  SoftDeleteAreaCode,
  UpdateAreaCode,
} from '../../state/area-code.actions';
import { Store } from '@ngxs/store';
import { AreaCodesState } from '../../state/area-code.state';

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
    },
    {
      field: 'Type',
      headerName: 'Type',
      sortable: true,
      flex: 1,
      minWidth: 180,
      editable: true,
      // cellEditor: 'agSelectCellEditor',
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
    },

    {
      headerName: 'Delete',
      // field: 'isDeleted',
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
      onCellClicked: (params: any) => this.softDeleteProvider(params.data),
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

    // Just mark the row as edited; don't save automatically
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

          // Clear edited flag after save
          row.isEdited = false;
          this.gridApi.applyTransaction({ update: [row] });

          // Optionally reload
          this.store.dispatch(new LoadAreaCodes());
        },
        (error) => {
          alert('Error saving area code.');
          console.error(error);
        }
      );
    } else {
      alert('Please complete all required fields before saving.');
    }
  }

  getRowClass = (params: any) => {
    // If AreaCodeId is not present, it's a newly added temporary row
    return !params.data.AreaCodeId ? 'temporary-row' : '';
  };

  softDeleteProvider(areaCode: AreaCodes): void {
    const updatedAreaCode = { ...areaCode, isDeleted: true };
    this.store.dispatch(new SoftDeleteAreaCode(updatedAreaCode));
  }

  addRow(): void {
    const newRow: AreaCodes = {
      // AreaCodeId: 0,
      AreaCode: '',
      Description: '',
      Type: 'Landline',
      IsActive: true,

      // isDeleted: false,
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
          this.softDeleteProvider(params.node.data);
        }
      },
      icon: '<i class="fas fa-trash"></i>',
    };

    return [addRow, deleteRow, 'separator', 'copy', 'export'];
  };
}
