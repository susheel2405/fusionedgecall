import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
 
import { catchError, tap } from 'rxjs/operators';
import { AreaCodes } from '../models/AreaCodes';
import { AreaCodesService } from '../services/areacodes/area-codes.service';
import {  AddAreaCodeRowLocally, LoadAreaCodes, DeleteAreaCode, UpdateAreaCode } from './area-code.actions';
import { throwError } from 'rxjs';
 
export interface AreaCodesStateModel {
  areaCodes: AreaCodes[];
}
 
@State<AreaCodesStateModel>({
  name: 'areaCodes',
  defaults: {
    areaCodes: [],
  },
})
@Injectable()
export class AreaCodesState {
  constructor(private areaCodesService: AreaCodesService) {}

  @Selector()
  static getAreaCodes(state: AreaCodes[]): AreaCodes[] {
    return state;
  }

  @Action(LoadAreaCodes)
  loadAreaCodes(ctx: StateContext<AreaCodes[]>) {
    return this.areaCodesService.getAreaCodes().pipe(
      tap((areaCodes) => {
        ctx.setState(areaCodes);
      })
    );
  }

  @Action(AddAreaCodeRowLocally)
  addAreaCodeRowLocally(ctx: StateContext<AreaCodes[]>, action: AddAreaCodeRowLocally) {
    const state = ctx.getState();
    ctx.setState([...state, action.payload]);
  }

  @Action(UpdateAreaCode)
  updateAreaCode(ctx: StateContext<AreaCodes[]>, action: UpdateAreaCode) {
    const state = ctx.getState();
    const updatedAreaCodes = state.map((areaCode) =>
      areaCode.AreaCodeId === action.payload.AreaCodeId ? action.payload : areaCode
    );
    ctx.setState(updatedAreaCodes);
  }

  @Action(DeleteAreaCode)
  deleteAreaCode(ctx: StateContext<AreaCodes[]>, action: DeleteAreaCode) {
    const areaCode = action.payload;
    if (!areaCode.AreaCodeId) {
      console.error('Cannot delete area code: AreaCodeId is undefined', areaCode);
      return throwError(() => new Error('AreaCodeId is undefined'));
    }

    return this.areaCodesService.deleteAreaCode(areaCode.AreaCodeId).pipe(
      tap(() => {
        const state = ctx.getState();
        const updatedState = state.filter((ac) => ac.AreaCodeId !== areaCode.AreaCodeId);
        ctx.setState(updatedState);
      }),
      catchError((error) => {
        console.error('Error in state deleteAreaCode:', error);
        return throwError(() => error);
      })
    );
  }
}
 
 