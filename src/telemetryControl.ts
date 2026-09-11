import { NotebookPanel } from '@jupyterlab/notebook';
import { Widget } from '@lumino/widgets';

/** Toolbar item name (unique per notebook panel toolbar). */
export const TELEMETRY_TOOLBAR_ITEM = 'telemetryControl';

const ENABLED_VALUE = 'enabled';
const DISABLED_VALUE = 'disabled';

const telemetryEnabledByPanel = new WeakMap<NotebookPanel, boolean>();

function createTelemetrySelect(panel: NotebookPanel): Widget {
  const root = document.createElement('div');
  root.className = 'jp-Notebook-toolbarTelemetry';

  const htmlSelect = document.createElement('div');
  htmlSelect.className =
    'jp-HTMLSelect jp-DefaultStyle jp-Notebook-toolbarTelemetryDropdown';

  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Telemetry collection');
  select.title = 'Telemetry collection';

  const optionEnabled = document.createElement('option');
  optionEnabled.value = ENABLED_VALUE;
  optionEnabled.textContent = 'Telemetry (enabled)';

  const optionDisabled = document.createElement('option');
  optionDisabled.value = DISABLED_VALUE;
  optionDisabled.textContent = 'Telemetry (disabled)';

  select.append(optionEnabled, optionDisabled);
  select.value = ENABLED_VALUE;
  telemetryEnabledByPanel.set(panel, true);

  select.addEventListener('change', () => {
    telemetryEnabledByPanel.set(panel, select.value === ENABLED_VALUE);
  });

  htmlSelect.appendChild(select);
  root.appendChild(htmlSelect);
  return new Widget({ node: root });
}

/**
 * Add telemetry dropdown immediately after the cell-type selector on the notebook toolbar.
 */
export function addTelemetryToolbarSelect(panel: NotebookPanel): void {
  const widget = createTelemetrySelect(panel);
  const inserted = panel.toolbar.insertAfter(
    'cellType',
    TELEMETRY_TOOLBAR_ITEM,
    widget
  );

  if (!inserted) {
    panel.toolbar.addItem(TELEMETRY_TOOLBAR_ITEM, widget);
  }
}

/**
 * Whether telemetry export is enabled for this notebook panel.
 * Defaults to true when the toolbar control has not been created yet.
 */
export function isTelemetryCollectionEnabled(panel: NotebookPanel): boolean {
  return telemetryEnabledByPanel.get(panel) ?? true;
}
