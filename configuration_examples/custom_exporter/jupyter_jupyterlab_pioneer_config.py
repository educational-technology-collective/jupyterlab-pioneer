# This file should be saved into one of the config directories provided by `jupyter --path`.

def my_custom_exporter(args):
    # write your own exporter logic here
    return {
        "exporter": args.get("id"),
        "message": ""
    }

c.JupyterLabPioneerApp.exporters = [
    {
        "type": "custom_exporter",
        "args": {
            "id": "MyCustomExporter"
            # add additional args for your exporter function here
        },
    }
]

c.JupyterLabPioneerApp.custom_exporter = {
    'MyCustomExporter': my_custom_exporter,
}

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
