from ._version import __version__
from jupyter_server.base.handlers import JupyterHandler
from jupyter_server.extension.handler import ExtensionHandlerMixin
import os, json, tornado, inspect
from tornado.httpclient import AsyncHTTPClient, HTTPRequest
from tornado.httputil import HTTPHeaders
from tornado.escape import to_unicode

# Exporters
def console_exporter(args):
    return ({
        'exporter': args.get('id') or 'ConsoleExporter',
        'message': args['data']
    })

def command_line_exporter(args):
    print(args['data'])
    return ({
        'exporter': args.get('id') or 'CommandLineExporter',
    }) 

def file_exporter(args):
    f = open(args.get('path'), 'a+', encoding='utf-8')
    json.dump(args['data'], f, ensure_ascii=False, indent=4)
    f.write(',')
    f.close()
    return({
        'exporter': args.get('id') or 'FileExporter',
    })
 
async def remote_exporter(args):
    http_client = AsyncHTTPClient()
    request = HTTPRequest(
        url=args.get('url'),
        method='POST',
        body=json.dumps({
            'data': args['data'],
            'params': args.get('params'), # none if exporter does not contain 'params'
            'env': [{x: os.getenv(x)} for x in args.get('env')] if (args.get('env')) else []
        }),
        headers=HTTPHeaders({'content-type': 'application/json'})
    )
    response = await http_client.fetch(request, raise_error=False)
    return({
        'exporter': args.get('id') or 'RemoteExporter',
        'message': {
            'code': response.code,
            'reason': response.reason,
            'body': to_unicode(response.body),
        },
    })

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
                self.finish(json.dumps({k:v for k, v in os.environ.items()}))
            elif resource == 'config':
                self.finish(json.dumps({
                    "activeEvents": self.extensionapp.activeEvents,
                    "logNotebookContentEvents": self.extensionapp.logNotebookContentEvents 
                }))
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
            args = each.get('args') or {} # id, url, path, params, env
            args['data'] = data

            if callable(exporter):
                result = await exporter(args) if inspect.iscoroutinefunction(exporter) else exporter(args)
                results.append(result)
            else:
                results.append({
                    'message': '[Error] exporter is not callable'
                })

        return results

