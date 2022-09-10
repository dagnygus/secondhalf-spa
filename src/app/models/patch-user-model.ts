export interface MutablePatchUserModel {
  userId: string;
  fieldName: string;
  newValue: any;
}

export type PatchUserModel = Readonly<MutablePatchUserModel>;
