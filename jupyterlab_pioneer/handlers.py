import os
import json
import inspect
import tornado
from jupyter_server.base.handlers import JupyterHandler
from jupyter_server.extension.handler import ExtensionHandlerMixin
from ._version import __version__

class RouteHandler(ExtensionHandlerMixin, JupyterHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self, resource):
        try:
            self.set_header('Content-Type', 'application/json')
            if resource == 'version':
                self.finish(json.dumps(__version__))
            elif resource == 'environ':
                self.finish(json.dumps(dict(os.environ.items())))
            elif resource == 'config':
                self.finish(json.dumps(self.config))
            else:
                self.set_status(404)
        except Exception as e:
            self.log.error(str(e))
            self.set_status(500)
            self.finish(json.dumps(str(e)))

    @tornado.web.authenticated
    async def post(self, resource):
        try:
            if resource == 'export':
                result = await self.export()
                self.finish(json.dumps(result))
            else:
                self.set_status(404)

        except Exception as e:
            self.log.error(str(e))
            self.set_status(500)
            self.finish(json.dumps(str(e)))

    async def export(self):
        exporters = self.extensionapp.exporters
        data = json.loads(self.request.body)
        results = []

        for each in exporters:
            exporter = each.get('exporter')
            active_events = each.get('active_events') or self.extensionapp.active_events
            if data.get('eventDetail').get('eventName') in active_events:
                args = each.get('args') or {} # id, url, path, params, env
                args['data'] = data

                if callable(exporter):
                    if inspect.iscoroutinefunction(exporter):
                        result = await exporter(args)
                    else:
                        result = exporter(args)
                    results.append(result)
                else:
                    results.append({
                        'message': '[Error] exporter is not callable'
                    })

        return results
