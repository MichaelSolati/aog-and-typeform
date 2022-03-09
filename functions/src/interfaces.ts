export interface IDataOption {
  label: string | undefined;
  value: string | undefined;
}

export interface IData {
  ref: string | undefined;
  options: IDataOption[];
}
