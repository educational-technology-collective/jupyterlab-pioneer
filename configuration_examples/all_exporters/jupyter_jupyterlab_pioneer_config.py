# This file should be saved into one of the config directories provided by `jupyter --path`.

from jupyterlab_pioneer import handlers

"""
An array of the exporters.

This extension provides 4 default exporters in the handlers module:
`console_exporter`, which sends telemetry data to the browser console.
`command_line_exporter`, which sends telemetry data to the python console jupyter is running on.
`file_exporter`, which saves telemetry data to local file.
`remote_exporter`, which sends telemetry data to a remote http endpoint.

Additionally, users can import default exporters or write customized exporters in the configuration file.
"""
c.JupyterLabPioneerApp.exporters = [
    {
        # sends telemetry data to the browser console
        'exporter': handlers.console_exporter,
    },
    {
        # sends telemetry data to the python console jupyter is running on
        'exporter': handlers.command_line_exporter,
    },
    {
        # writes telemetry data to local file
        'exporter': handlers.file_exporter,
        'args': {
            'path': 'log'
        }
    },
    {
        # sends telemetry data to a remote http endpoint (AWS S3 bucket)
        'exporter': handlers.remote_exporter,
        'args': {
            'id': 'S3Exporter',
            'url': 'https://telemetry.mentoracademy.org/telemetry-edtech-labs-si-umich-edu/dev/test-telemetry',
            'env': ['WORKSPACE_ID'],
        }
    },
    {
        # sends telemetry data to a remote http endpoint (an AWS Lambda function that exports data to MongoDB)
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
    # {
    #     # sends telemetry data to a remote http endpoint (an AWS Lambda function that exports data to InfluxDB)
    #     'exporter': handlers.remote_exporter,
    #     'args': {
    #         'id': 'InfluxDBLambdaExporter',
    #         'url': 'https://68ltdi5iij.execute-api.us-east-1.amazonaws.com/influx',
    #         'params': {
    #             'influx_bucket': 'telemetry_dev',
    #             'influx_measurement': 'si101_fa24'
    #         }
    #     }
    # },
]

""" 
An array of the ids of the events. 
The extension would only generate and export data for valid events (
    1. that have an id associated with the event class, 
    2. the event id is included in `activeEvents`
).
"""
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

"""
An array of the ids of the events. 
The extension will export the entire notebook content only for valid events (
    1. that have an id associated with the event class,
    2. the event id is included in `logNotebookContentEvents`).
"""
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