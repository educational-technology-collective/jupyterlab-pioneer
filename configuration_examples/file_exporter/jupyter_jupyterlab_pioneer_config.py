# This file should be saved into one of the config directories provided by `jupyter --path`.

from jupyterlab_pioneer import handlers

c.JupyterLabPioneerApp.exporters = [
    {
        # write telemetry data to local file
        'exporter': handlers.file_exporter,
        'args': {
            'path': 'log'
        }
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