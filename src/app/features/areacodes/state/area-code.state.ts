import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
 
import { tap } from 'rxjs/operators';
import { AreaCodes } from '../models/AreaCodes';
import { AreaCodesService } from '../services/areacodes/area-codes.service';
import {  AddAreaCodeRowLocally, LoadAreaCodes, SoftDeleteAreaCode, UpdateAreaCode } from './area-code.actions';
 
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
  static getAreaCodes(state: AreaCodesStateModel) {
    return state.areaCodes;
  }
 
  // @Action(LoadAreaCodes)
  // loadAreaCodes(ctx: StateContext<AreaCodesStateModel>) {
  //   return this.areaCodesService.getAreaCodes().pipe(
  //     tap((areaCodes) => {
  //       console.log('AreaCodes loaded from API:', areaCodes);
  //       ctx.patchState({ areaCodes });
  //     })
  //   );
  // }
  @Action(LoadAreaCodes)
loadAreaCodes(ctx: StateContext<AreaCodesStateModel>) {
  return this.areaCodesService.getAreaCodes().pipe(
    tap((areaCodes) => {
      // Sort by AreaCodeId in descending order; handle undefined safely
      const sorted = [...areaCodes].sort((a, b) => {
        const idA = a.AreaCodeId ?? 0;
        const idB = b.AreaCodeId ?? 0;
        return idB - idA;
      });
 
      ctx.patchState({ areaCodes: sorted });
    })
  );
}
 
 
 
 
  @Action(AddAreaCodeRowLocally)
addRowLocally(ctx: StateContext<AreaCodesStateModel>, action: AddAreaCodeRowLocally) {
  const state = ctx.getState();
 
  ctx.patchState({
     ...state,
    areaCodes: [action.payload, ...state.areaCodes],
  });
}
 
 
  @Action(UpdateAreaCode)
  updateAreaCode(
    ctx: StateContext<AreaCodesStateModel>,
    action: UpdateAreaCode
  ) {
    const state = ctx.getState();
    const updatedAreaCodes = state.areaCodes.map((areaCode) =>
      areaCode.AreaCodeId === action.payload.AreaCodeId
        ? action.payload
        : areaCode
    );
    ctx.patchState({ areaCodes: updatedAreaCodes });
    return this.areaCodesService.updateAreaCode(action.payload);
  }
 
  @Action(SoftDeleteAreaCode)
  softDeleteAreaCode(
    ctx: StateContext<AreaCodesStateModel>,
    action: SoftDeleteAreaCode
  ) {
    const state = ctx.getState();
    const updatedAreaCodes = state.areaCodes.filter(
      (areaCode) => areaCode.AreaCodeId !== action.payload.AreaCodeId
    );
    ctx.patchState({ areaCodes: updatedAreaCodes });
    return this.areaCodesService.softDeleteAreaCode(action.payload);
  }
}
 
 