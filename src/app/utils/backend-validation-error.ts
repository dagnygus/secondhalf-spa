export interface BackendFailedValiadtionInfo {
  location: Location;
  param: string;
  value: any;
  msg: any;
  nestedErrors?: unknown[];
}

export interface BackendValiadtionError {
  code: 'unprocessable-entity';
  data: BackendFailedValiadtionInfo[];
}
