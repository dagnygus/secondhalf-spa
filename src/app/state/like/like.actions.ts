import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";

enum LikeActionsNames {
  likeMemeberStart = '[Like]Like member start',
  likeMemberSuccess = '[Like]Like member success',
  likeMemberFailed = '[Like]Like member failed',
}

export const likeStart = createAction(LikeActionsNames.likeMemeberStart, props<{ id: string }>())

export const likeSuccess = createAction(LikeActionsNames.likeMemberSuccess, props<{ id: string }>())

export const likeFailed =  createAction(LikeActionsNames.likeMemberFailed, props<{ httpError: HttpErrorResponse }>())
