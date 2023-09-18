# This file should be saved into one of the config directories provided by `jupyter --path`.

from jupyterlab_pioneer import handlers

c.JupyterLabPioneerApp.exporters = [
    {
        # sends telemetry data to a remote http endpoint (AWS S3 bucket)
        'exporter': handlers.remote_exporter,
        'args': {
            'id': 'S3Exporter',
            'url': 'https://telemetry.mentoracademy.org/telemetry-edtech-labs-si-umich-edu/dev/test-telemetry',
            'env': ['WORKSPACE_ID'],
        }
    },
    # {
    #     # sends telemetry data to a remote http endpoint (an AWS Lambda function that exports data to MongoDB)
    #     'exporter': handlers.remote_exporter,
    #     'args': {
    #         'id': 'MongoDBLambdaExporter',
    #         'url': 'https://68ltdi5iij.execute-api.us-east-1.amazonaws.com/mongo',
    #         'params': {
    #             'mongo_cluster': 'mengyanclustertest.6b83fsy.mongodb.net',
    #             'mongo_db': 'telemetry',
    #             'mongo_collection': 'dev'
    #             },
    #         'env': ['WORKSPACE_ID'],
    #     }
    # },
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