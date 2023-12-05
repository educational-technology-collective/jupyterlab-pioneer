"""This module defines the extension app name, reads configurable variables from the configuration file, and adds the extra request handlers from :mod:`.handlers` module to Jupyter Server's Tornado Web Application.
"""

from traitlets import List, Dict
from jupyter_server.extension.application import ExtensionApp
from .handlers import RouteHandler

class JupyterLabPioneerApp(ExtensionApp):
    name = "jupyterlab_pioneer"
    """Extension app name"""

    activeEvents = List([]).tag(config=True)
    """An array of active events defined in the configuration file.

    Global config, could be override by `activeEvents` defined inside of individual exporter configs.

    The extension would only generate and export data for valid events (
    1. that have an id associated with the event class, 
    2. the event name is included in `activeEvents`
    ).
    
    The extension will export the entire notebook content only for valid events when the `logWholeNotebook` flag is `True`.

    Examples:
        ::
        
            # in the configuration file
            c.JupyterLabPioneerApp.activeEvents = 
            [
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
    """

    exporters = List([]).tag(config=True)
    """ An array of the exporters defined in the configuration file.

    This extension provides 5 default exporters in the :mod:`.default_exporters` module:

    :func:`.default_exporters.console_exporter`, which sends telemetry data to the browser console.

    :func:`.default_exporters.command_line_exporter`, which sends telemetry data to the python console jupyter is running on.

    :func:`.default_exporters.file_exporter`, which saves telemetry data to local file.

    :func:`.default_exporters.remote_exporter`, which sends telemetry data to a remote http endpoint.

    :func:`.default_exporters.opentelemetry_exporter`, which sends telemetry data via otlp.

    Additionally, users can import default exporters or write customized exporters in the configuration file.

    Examples:
        ::

            # in the configuration file
            c.JupyterLabPioneerApp.exporters = 
            [
                {
                    "type": "console_exporter",
                },
                {
                    "type": "command_line_exporter",
                },
            ]
    """

    custom_exporter = Dict({}).tag(config=True)
    """A dictionary of custom exporter defined in the configuration file
    
    Examples:
        ::
        
            # in the configuration file
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
    """

    def initialize_handlers(self):
        """This function adds the extra request handlers from :mod:`.handlers` module to Jupyter Server's Tornado Web Application.
        """
        try:
            self.handlers.extend([(r"/jupyterlab-pioneer/(.*)", RouteHandler)])
        except Exception as e:
            self.log.error(str(e))
            raise e
