export interface ActiveEvent {
  name: string;
  logWholeNotebook: boolean;
}
export interface ExporterArgs {
  id: string;
  url?: string;
  params?: Object;
  path?: string;
  env?: Object[];
}

export interface Exporter {
  type: string;
  args?: ExporterArgs;
  activeEvents?: ActiveEvent[];
}

export interface Config {
  activeEvents: ActiveEvent[];
  exporters: Exporter[];
}
