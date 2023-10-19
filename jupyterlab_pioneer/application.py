from traitlets import List, Dict
from jupyter_server.extension.application import ExtensionApp
from .handlers import RouteHandler


class JupyterLabPioneerApp(ExtensionApp):
    name = "jupyterlab_pioneer"

    activeEvents = List([]).tag(config=True)
    exporters = List([]).tag(config=True)
    custom_exporter = Dict({}).tag(config=True)

    def initialize_handlers(self):
        try:
            self.handlers.extend([(r"/jupyterlab-pioneer/(.*)", RouteHandler)])
        except Exception as e:
            self.log.error(str(e))
            raise e
