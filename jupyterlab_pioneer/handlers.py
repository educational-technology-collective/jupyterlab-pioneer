"""This module defines the extra request handlers the pioneer extension needs
"""
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
        """GET method

        Args:
            resource (str): the name of the resource requested. It is expected to be one of "version", "environ", or "config".
        
        Returns:
            str(json):
                If resource is "version", the server responses with a json serialized obj of the version string.

                If resource is "environ", the server responses with a json serialized obj of current environment variables.

                If resource is "config", the server responses with a json serialized obj containing "activeEvents" and "exporters" configurations from the configuration file.

                For other resources, set the status code to 404 not found.
        
        """
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
        """POST method

        Args:
            resource (str): the name of the resource requested. It is expected to be "export".
        
        Returns:
            str(json):
            If resource is "export", the server calls the asynchronous export function :func:`export`, and responses with the json serialized export result.
            
            For other resources, set the status code to 404 not found.
        """
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
        """This function exports telemetry data with requested exporters.

        The function first parse the request body to get the event data and the corresponding exporter requested for the event. 
        Then base on the exporter type, the function either calls the default exporters or tries to access the custom exporter defined in the configuration file. 

        Returns:
            dict:
                ::

                    {
                        "exporter": # exporter type,
                        "message": # execution message of the exporter function
                    }
        """
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
