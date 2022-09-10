import { MemberModel } from 'src/app/models/member-model';
import { DocumentData, FirestoreDataConverter } from '@angular/fire/firestore';
import { AuthModel, MutableAuthModel } from './auth-model';

export interface MutableFsUserModel {
  userId: string;
  firstName: string;
  lastName: string;
  nickName: string;
  gender: string;
  email: string;
  aboutMySelf?: string;
  dateOfBirth: string;
  isActive: false;
  createdAt: string;
  mainPhotoUrl?: string | null;
  city?: string | null;
  street?: string | null;
  state?: string | null;
  country?: string | null;
}

export type FsUserModel = Readonly<MutableFsUserModel>;

export interface FsUserMetadataModel {
  count: number;
  active: number;
}

export enum FsUserModelFieldNames {
  userId = 'userId',
  firstName = 'firstName',
  lastName = 'lastName',
  nickName = 'nickName',
  gender = 'gender',
  aboutMySelf = 'aboutMySelf',
  dateOfBirth = 'dateOfBirth',
  isActive = 'isActive',
  mainPhotoUrl = 'mainPhotoUrl',
  createdAt = 'createdAt',
  city = 'city',
  street = 'street',
  state = 'state',
  country = 'country'
}

export function createAuthModel(fsUserDto: FsUserModel): AuthModel {
  const authModel: MutableAuthModel = {} as any;

  for (const prop in fsUserDto) {
    if (prop !== 'isActive' && prop !== 'city' && prop !== 'street' &&  prop !== 'state' && prop !== 'county') {
      (authModel as any)[prop] = (fsUserDto as any)[prop];
    }
  }

  authModel.hasAddressInfo = false;

  if (fsUserDto.city && fsUserDto.state && fsUserDto.street && fsUserDto.country) {
    authModel.hasAddressInfo = true;
    authModel.city = fsUserDto.city;
    authModel.street = fsUserDto.street;
    authModel.state = fsUserDto.state;
    authModel.country = fsUserDto.country;
  }

  return authModel;

}
