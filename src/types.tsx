export interface ActiveEvent {
  /**
   * Name of the active event (the static id associate with the event class)
   */
  name: string;
  /**
   * Whether to log the whole notebook or not when the event is triggered
   */
  logWholeNotebook: boolean;
}
export interface ExporterArgs {
  /**
   * Exporter ID
   */
  id: string;
  /**
   * Local file path (required for file exporter)
   */
  path?: string;
  /**
   * Http endpoint (required for remote exporter)
   */
  url?: string;
  /**
   * Additional parameters to pass to the http endpoint (optional for remote exporter)
   */
  params?: Object;
  /**
   * Environment variables to pass to the http endpoint (optional for remote exporter)
   */
  env?: Object[];
}

export interface Exporter {
  /**
   * Exporter type, should be one of "console_exporter", "command_line_exporter", "file_exporter", "remote_exporter", "opentelemetry_exporter" or "custom_exporter"
   */
  type: string;
  /**
   * Arguments to pass to the exporter function
   */
  args?: ExporterArgs;
  /**
   * An array of active events defined inside of individual exporters. It overrides the global activeEvents configuration defined in the configuration file.
   * The extension would only generate and export data for valid events ( 1. that have an id associated with the event class, 2. the event name is included in activeEvents ).
   * The extension will export the entire notebook content only for valid events when the logWholeNotebook flag is True.
   */
  activeEvents?: ActiveEvent[];
}

export interface Config {
  /**
   * An array of active events
   */
  activeEvents: ActiveEvent[];
  /**
   * An array of exporters
   */
  exporters: Exporter[];
}
