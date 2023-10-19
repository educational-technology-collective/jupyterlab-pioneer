import os
import json
import inspect
import tornado
from jupyter_server.base.handlers import JupyterHandler
from jupyter_server.extension.handler import ExtensionHandlerMixin
from ._version import __version__
from .default_exporters import default_exporters


class RouteHandler(ExtensionHandlerMixin, JupyterHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self, resource):
        try:
            self.set_header("Content-Type", "application/json")
            if resource == "version":
                self.finish(json.dumps(__version__))
            elif resource == "environ":
                self.finish(json.dumps(dict(os.environ.items())))
            elif resource == "config":
                self.finish(
                    json.dumps(
                        {
                            "activeEvents": self.extensionapp.activeEvents,
                            "exporters": self.extensionapp.exporters,
                        }
                    )
                )
            else:
                self.set_status(404)
        except Exception as e:
            self.log.error(str(e))
            self.set_status(500)
            self.finish(json.dumps(str(e)))

    @tornado.web.authenticated
    async def post(self, resource):
        try:
            if resource == "export":
                result = await self.export()
                self.finish(json.dumps(result))
            else:
                self.set_status(404)

        except Exception as e:
            self.log.error(str(e))
            self.set_status(500)
            self.finish(json.dumps(str(e)))

    async def export(self):
        body = json.loads(self.request.body)
        exporter = body.get("exporter")
        data = {
            "eventDetail": body.get("eventDetail"),
            "notebookState": body.get("notebookState"),
        }
        exporter_type = exporter.get("type")
        args = exporter.get("args") or {}  # id, url, path, params, env
        args["data"] = data
        if exporter_type in default_exporters:
            exporter_func = default_exporters[exporter_type]
            if inspect.iscoroutinefunction(exporter_func):
                result = await exporter_func(args)
            else:
                result = exporter_func(args)
            return result
        if exporter_type == "custom_exporter":
            custom_exporter = self.extensionapp.custom_exporter
            if (
                custom_exporter
                and args.get("id") in custom_exporter
                and custom_exporter.get(args.get("id"))
            ):
                exporter_func = custom_exporter.get(args.get("id"))
                if inspect.iscoroutinefunction(exporter_func):
                    result = await exporter_func(args)
                else:
                    result = exporter_func(args)
                return result
            else:
                return {
                    "exporter": exporter_type,
                    "message": "[Error] custom exporter is not defined",
                }
        return {
            "exporter": exporter_type,
            "message": "[Error] exporter is not supported",
        }
