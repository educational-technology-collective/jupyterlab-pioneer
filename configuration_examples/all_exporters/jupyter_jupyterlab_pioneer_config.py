# This file should be saved into one of the config directories provided by `jupyter --path`.

"""An array of the exporters.

This extension provides 5 default exporters:
`console_exporter`, which sends telemetry data to the browser console.
`command_line_exporter`, which sends telemetry data to the python console jupyter is running on.
`file_exporter`, which saves telemetry data to local file.
`remote_exporter`, which sends telemetry data to a remote http endpoint.
`opentelemetry_exporter`, which sends telemetry data via otlp.

Additionally, users can import default exporters or write customized exporters in the configuration file.
"""
c.JupyterLabPioneerApp.exporters = [
    {
        # sends telemetry data to the browser console
        "type": "console_exporter",
    },
    {
        # sends telemetry data to the python console jupyter is running on
        "type": "command_line_exporter",
    },
    {
        # writes telemetry data to local file
        "type": "file_exporter",
        "args": {
            "path": "log"
        },
    },
    {
        # sends telemetry data to a remote http endpoint (AWS S3 bucket)
        "type": "remote_exporter",
        "args": {
            "id": "S3Exporter",
            "url": "https://telemetry.mentoracademy.org/telemetry-edtech-labs-si-umich-edu/dev/test-telemetry",
            "env": ["WORKSPACE_ID"],
        },
    },
    {
        # sends telemetry data to a remote http endpoint (an AWS Lambda function that exports data to MongoDB)
        "type": "remote_exporter",
        "args": {
            "id": "MongoDBLambdaExporter",
            "url": "https://68ltdi5iij.execute-api.us-east-1.amazonaws.com/mongo",
            "params": {
                "mongo_cluster": "mengyanclustertest.6b83fsy.mongodb.net",
                "mongo_db": "telemetry",
                "mongo_collection": "dev",
            },
            "env": ["WORKSPACE_ID"],
        },
    },
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

"""An array of active events.
This is a global config. It could be override by `activeEvents` defined inside of individual exporter configs
The extension would only generate and export data for valid events (
    1. that have an id associated with the event class, 
    2. the event name is included in `activeEvents`
).
The extension will export the entire notebook content only for valid events with the logWholeNotebook flag == True
"""
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
