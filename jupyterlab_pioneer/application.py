from .handlers import RouteHandler
from jupyter_server.extension.application import ExtensionApp
from traitlets import List

class JupyterLabPioneerApp(ExtensionApp):

    name = "jupyterlab_pioneer"

    activeEvents = List([]).tag(config=True)
    logNotebookContentEvents = List([]).tag(config=True)
    exporters = List([]).tag(config=True)

    def initialize_settings(self):
        try:
            assert self.activeEvents, "The c.JupyterLabPioneerApp.activeEvents configuration setting must be set."
            assert self.exporters, "The c.JupyterLabPioneerApp.exporters configuration must be set, please see the configuration example"

        except Exception as e:
            self.log.error(str(e))
            raise e

    def initialize_handlers(self):
        try:
            self.handlers.extend([(r"/jupyterlab-pioneer/(.*)", RouteHandler)])
        except Exception as e:
            self.log.error(str(e))
            raise e
