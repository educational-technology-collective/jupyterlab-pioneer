# This file should be saved into one of the config directories provided by `jupyter --path`.

c.JupyterLabPioneerApp.exporters = [
    {
        # sends telemetry data to a remote http endpoint (AWS S3 bucket)
        "type": "remote_exporter",
        "args": {
            "id": "S3Exporter",
            "url": "https://telemetry.mentoracademy.org/telemetry-edtech-labs-si-umich-edu/dev/test-telemetry",
            "env": ["WORKSPACE_ID"],
        },
    },
    # {
    #     # sends telemetry data to a remote http endpoint (an AWS Lambda function that exports data to MongoDB)
    #     "type": "remote_exporter",
    #     "args": {
    #         "id": "MongoDBLambdaExporter",
    #         "url": "https://68ltdi5iij.execute-api.us-east-1.amazonaws.com/mongo",
    #         "params": {
    #             "mongo_cluster": "mengyanclustertest.6b83fsy.mongodb.net",
    #             "mongo_db": "telemetry",
    #             "mongo_collection": "dev",
    #         },
    #         "env": ["WORKSPACE_ID"],
    #     },
    # },
    {
        # sends telemetry data to a remote http endpoint (an AWS Lambda function that exports data to InfluxDB)
        "type": "remote_exporter",
        "args": {
            "id": "InfluxDBLambdaExporter",
            "url": "https://68ltdi5iij.execute-api.us-east-1.amazonaws.com/influx",
            "params": {
                "influx_bucket": "telemetry_dev",
                "influx_measurement": "si101_fa24",
            },
        },
        "activeEvents": [
            {"name": "CellEditEvent", "logWholeNotebook": False},
        ],  # exporter's local active_events config will override global activeEvents config
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
