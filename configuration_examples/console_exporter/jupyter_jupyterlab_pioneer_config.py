# This file should be saved into one of the config directories provided by `jupyter --path`.

from jupyterlab_pioneer import handlers

c.JupyterLabPioneerApp.exporters = [
    {
        # sends telemetry data to the browser console
        'exporter': handlers.console_exporter,
    },
    {
        # sends telemetry data to the python console jupyter is running on
        'exporter': handlers.command_line_exporter,
    },
]

c.JupyterLabPioneerApp.activeEvents = [
    'NotebookOpenEvent',
    'NotebookScrollEvent',
    # 'NotebookVisibleEvent',
    # 'NotebookHiddenEvent',
    'ClipboardCopyEvent',
    'ClipboardCutEvent',
    'ClipboardPasteEvent',
    'ActiveCellChangeEvent',
    'NotebookSaveEvent',
    'CellExecuteEvent',
    'CellAddEvent',
    'CellRemoveEvent',
]

c.JupyterLabPioneerApp.logNotebookContentEvents = [
    'NotebookOpenEvent',
    # 'NotebookScrollEvent',
    # 'NotebookVisibleEvent',
    # 'NotebookHiddenEvent',
    # 'ClipboardCopyEvent',
    # 'ClipboardCutEvent',
    # 'ClipboardPasteEvent',
    # 'ActiveCellChangeEvent',
    'NotebookSaveEvent',
    # 'CellExecuteEvent',
    # 'CellAddEvent',
    # 'CellRemoveEvent',
]