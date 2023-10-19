# This file should be saved into one of the config directories provided by `jupyter --path`.

c.JupyterLabPioneerApp.exporters = [
    {
        # writes telemetry data to local file
        "type": "file_exporter",
        "args": {
            "path": "log"
        },
    },
]

c.JupyterLabPioneerApp.activeEvents = [
    {"name": "ActiveCellChangeEvent", "logWholeNotebook": False},
    {"name": "CellAddEvent", "logWholeNotebook": False},
    # {"name": "CellEditEvent", "logWholeNotebook": False},
    {"name": "CellExecuteEvent", "logWholeNotebook": False},
    {"name": "CellRemoveEvent", "logWholeNotebook": False},
    # {"name": "ClipboardCopyEvent", "logWholeNotebook": False},
    # {"name": "ClipboardCutEvent", "logWholeNotebook": False},
    # {"name": "ClipboardPasteEvent", "logWholeNotebook": False},
    # {"name": "NotebookHiddenEvent", "logWholeNotebook": False},
    # {"name": "NotebookOpenEvent", "logWholeNotebook": False},
    # {"name": "NotebookSaveEvent", "logWholeNotebook": False},
    # {"name": "NotebookScrollEvent", "logWholeNotebook": False},
    # {"name": "NotebookVisibleEvent", "logWholeNotebook": False},
]
