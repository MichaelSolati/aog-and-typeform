export interface DataOption {
  label: string | undefined;
  value: string | undefined;
}

export interface SessionParams {
  ref: string | undefined;
  options: DataOption[];
}
