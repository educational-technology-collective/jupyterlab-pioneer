# This file should be saved into one of the config directories provided by `jupyter --path`.

c.JupyterLabPioneerApp.exporters = [
    {
        # sends telemetry data to the browser console
        "type": "console_exporter",
    },
    {
        # sends telemetry data to the python console jupyter is running on
        "type": "command_line_exporter",
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