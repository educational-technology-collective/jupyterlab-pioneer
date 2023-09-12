from .handlers import RouteHandler
from jupyter_server.extension.application import ExtensionApp
from traitlets import List

class JupyterLabTelemetrySystemApp(ExtensionApp):

    name = "jupyterlab_telemetry_system"

    activeEvents = List([]).tag(config=True)
    logNotebookContentEvents = List([]).tag(config=True)
    exporters = List([]).tag(config=True)

    def initialize_settings(self):
        try:
            assert self.activeEvents, "The c.JupyterLabTelemetrySystemApp.activeEvents configuration setting must be set."
            assert self.exporters, "The c.JupyterLabTelemetrySystemApp.exporters configuration must be set, please see the configuration example"

        except Exception as e:
            self.log.error(str(e))
            raise e

    def initialize_handlers(self):
        try:
            self.handlers.extend([(r"/jupyterlab-telemetry-system/(.*)", RouteHandler)])
        except Exception as e:
            self.log.error(str(e))
            raise e
