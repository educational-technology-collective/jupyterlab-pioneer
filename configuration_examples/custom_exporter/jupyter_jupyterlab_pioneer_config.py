# This file should be saved into one of the config directories provided by `jupyter --path`.

def customized_exporter(args):
    # write your own exporter logic here
    return ({
        'exporter': 'CustomizedExporter',
        'message': ''
    })

c.JupyterLabPioneerApp.exporters = [
    {
        'exporter': customized_exporter,
        'args': {
            # add additional args for your exporter function here
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