import json
import os
from collections.abc import Callable, Awaitable
from tornado.httpclient import AsyncHTTPClient, HTTPRequest
from tornado.httputil import HTTPHeaders
from tornado.escape import to_unicode


def console_exporter(args: dict) -> dict:
    """This exporter sends telemetry data to the browser console.

    Args:
        args: arguments that would be passed to the exporter function,
        defined in the configuration file (except data).
        It has the following structure:
        { \n
            'id': exporter id, optional, \n
            'data': telemetry data \n
        }

    Returns:
        dict:
        { \n
            'exporter': exporter id or 'ConsoleExporter', \n
            'message': telemetry data \n
        }
    """

    return {"exporter": args.get("id") or "ConsoleExporter", "message": args["data"]}


def command_line_exporter(args: dict) -> dict:
    """This exporter sends telemetry data to the python console jupyter is running on.

    Args:
        args (dict): arguments that would be passed to the exporter function,
        defined in the configuration file (except data).
        It has the following structure:
        { \n
            'id': exporter id, optional, \n
            'data': telemetry data \n
        }

    Returns:
        dict:
        { \n
            'exporter': exporter id or 'CommandLineExporter', \n
        }
    """

    print(args["data"])
    return {
        "exporter": args.get("id") or "CommandLineExporter",
    }


def file_exporter(args: dict) -> dict:
    """This exporter writes telemetry data to local file.

    Args:
        args (dict): arguments that would be passed to the exporter function,
        defined in the configuration file (except data).
        It has the following structure:
        { \n
            'id': exporter id, optional, \n
            'path': path to the target log file, \n
            'data': telemetry data \n
        }

    Returns:
        dict:
        { \n
            'exporter': exporter id or 'FileExporter', \n
        }
    """

    with open(args.get("path"), "a+", encoding="utf-8") as f:
        json.dump(args["data"], f, ensure_ascii=False, indent=4)
        f.write(",")
    return {
        "exporter": args.get("id") or "FileExporter",
    }


async def remote_exporter(args: dict) -> dict:
    """This exporter sends telemetry data to a remote http endpoint.

    Args:
        args (dict): arguments that would be passed to the exporter function,
        defined in the configuration file (except data).
        It has the following structure:
        { \n
            'id': exporter id, optional, \n
            'url': http endpoint url, \n
            'params': extra parameters that would be passed to the http endpoint, optional, \n
            'env': environment variables that would be passed to the http endpoint, optional, \n
            'data': telemetry data \n
        }

    Returns:
        dict:
        { \n
            'exporter': exporter id or 'RemoteExporter', \n
            'message': { \n
                'code': http response code, \n
                'reason': http response reason, \n
                'body': http response body \n
            } \n
        }
    """
    http_client = AsyncHTTPClient()
    request = HTTPRequest(
        url=args.get("url"),
        method="POST",
        body=json.dumps(
            {
                "data": args["data"],
                "params": args.get(
                    "params"
                ),  # none if exporter does not contain 'params'
                "env": [{x: os.getenv(x)} for x in args.get("env")]
                if (args.get("env"))
                else [],
            }
        ),
        headers=HTTPHeaders({"content-type": "application/json"}),
    )
    response = await http_client.fetch(request, raise_error=False)
    return {
        "exporter": args.get("id") or "RemoteExporter",
        "message": {
            "code": response.code,
            "reason": response.reason,
            "body": to_unicode(response.body),
        },
    }


default_exporters: dict[str, Callable[[dict], dict or Awaitable[dict]]] = {
    "console_exporter": console_exporter,
    "command_line_exporter": command_line_exporter,
    "file_exporter": file_exporter,
    "remote_exporter": remote_exporter,
}
