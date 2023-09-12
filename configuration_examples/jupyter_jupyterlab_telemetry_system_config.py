# This file should be saved into one of the config directories provided by `jupyter --path`.

c.JupyterLabTelemetrySystemApp.activeEvents = [
    'NotebookOpenEvent',
    'NotebookScrollEvent',
    'NotebookVisibleEvent',
    'NotebookHiddenEvent',
    'ClipboardCopyEvent',
    'ClipboardCutEvent',
    'ClipboardPasteEvent',
    'ActiveCellChangeEvent',
    'NotebookSaveEvent',
    'CellExecuteEvent',
    'CellAddEvent',
    'CellRemoveEvent',
]

c.JupyterLabTelemetrySystemApp.logNotebookContentEvents = [
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

# This file should be saved into one of the config directories provided by `jupyter --path`.
from jupyterlab_telemetry_system import handlers

def customized_exporter(args):
    # do more here
    return ({
        'exporter': 'CustomizedCommandLineExporter',
    })

c.JupyterLabTelemetrySystemApp.exporters = [
    {
        'exporter': handlers.console_exporter,
    },
    {
        'exporter': handlers.command_line_exporter,
    },
    {
        'exporter': handlers.file_exporter,
        'args': {
            'path': 'log'
        }
    },
    {
        'exporter': handlers.remote_exporter,
        'args': {
            'id': 'S3Exporter',
            'url': 'https://telemetry.mentoracademy.org/telemetry-edtech-labs-si-umich-edu/dev/test-telemetry',
            'env': ['WORKSPACE_ID'],
        }
    },
    {
        'exporter': handlers.remote_exporter,
        'args': {
            'id': 'MongoDBLambdaExporter',
            'url': 'https://68ltdi5iij.execute-api.us-east-1.amazonaws.com/mongo',
            'params': {
                'mongo_cluster': 'mengyanclustertest.6b83fsy.mongodb.net',
                'mongo_db': 'telemetry',
                'mongo_collection': 'dev'
                },
            'env': ['WORKSPACE_ID'],
        }
    },
    {
        'exporter': handlers.remote_exporter,
        'args': {
            'id': 'InfluxDBLambdaExporter',
            'url': 'https://68ltdi5iij.execute-api.us-east-1.amazonaws.com/influx',
            'params': {
                'influx_bucket': 'telemetry_dev',
                'influx_measurement': 'si101_fa24'
            }
        }
    },
    {
        'exporter': customized_exporter,
        'args': {
            # do more here
        }
     },
]