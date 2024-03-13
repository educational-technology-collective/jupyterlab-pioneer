"""This module provides 5 default exporters for the extension. If the exporter function name is mentioned in the configuration file or in the notebook metadata, the extension will use the corresponding exporter function when the jupyter lab event is fired.

Attributes:
    default_exporters: a map from function names to callable exporter functions::

        default_exporters: dict[str, Callable[[dict], dict or Awaitable[dict]]] = {
            "console_exporter": console_exporter,
            "command_line_exporter": command_line_exporter,
            "file_exporter": file_exporter,
            "remote_exporter": remote_exporter,
            "opentelemetry_exporter": opentelemetry_exporter,
        }
"""

import json
import os
import datetime
from collections.abc import Callable, Awaitable
from tornado.httpclient import AsyncHTTPClient, HTTPRequest
from tornado.httputil import HTTPHeaders
from tornado.escape import to_unicode


def console_exporter(args: dict) -> dict:
    """This exporter sends telemetry data to the browser console.

    Args:
        args(dict): arguments to pass to the exporter function, defined in the configuration file (except 'data', which is gathered by the extension). It has the following structure:
            ::

                {
                    'id': # (optional) exporter id,
                    'data': # telemetry data
                }

    Returns:
        dict:
            ::

                {
                    'exporter': # exporter id or 'ConsoleExporter',
                    'message': # telemetry data
                }

    """

    return {"exporter": args.get("id") or "ConsoleExporter", "message": args["data"]}


def command_line_exporter(args: dict) -> dict:
    """This exporter sends telemetry data to the python console jupyter is running on.

    Args:
        args (dict): arguments to pass to the exporter function, defined in the configuration file (except 'data', which is gathered by the extension). It has the following structure:
            ::

                {
                    'id': # (optional) exporter id,
                    'data': # telemetry data
                }

    Returns:
        dict:
            ::

                {
                    'exporter': # exporter id or 'CommandLineExporter',
                }
    
    """

    print(args["data"])
    return {
        "exporter": args.get("id") or "CommandLineExporter",
    }


def file_exporter(args: dict) -> dict:
    """This exporter writes telemetry data to local file.

    Args:
        args (dict): arguments to pass to the exporter function, defined in the configuration file (except 'data', which is gathered by the extension). It has the following structure:
            ::

                {
                    'id': # (optional) exporter id,
                    'path': # local file path,
                    'data': # telemetry data
                }

    Returns:
        dict:
            ::

                {
                    'exporter': # exporter id or 'FileExporter',
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
        args (dict): arguments to pass to the exporter function, defined in the configuration file (except 'data', which is gathered by the extension). It has the following structure:
            ::

                {
                    'id': # (optional) exporter id,
                    'url': # http endpoint url,
                    'params': # (optional) additional parameters to pass to the http endpoint,
                    'env': # (optional) environment variables to pass to the http endpoint,
                    'data': # telemetry data
                }

    Returns:
        dict:
            ::

                {
                    'exporter': exporter id or 'RemoteExporter',
                    'message': {
                        'code': http response code,
                        'reason': http response reason,
                        'body': http response body
                    }
                }

    """
    http_client = AsyncHTTPClient()
    unix_timestamp = args["data"].get("eventDetail").get("eventTime")
    utc_datetime = datetime.datetime.fromtimestamp(unix_timestamp/1000.0, tz=datetime.timezone.utc)
    url = args.get("url")
    if "s3" in args.get("id").lower():
        url = "%s/%d/%d/%d/%d" % (args.get("url"), utc_datetime.year, utc_datetime.month, utc_datetime.day, utc_datetime.hour)
    request = HTTPRequest(
        url=url,
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

def opentelemetry_exporter(args: dict) -> dict:
    """This exporter sends telemetry data via otlp

    """
    from opentelemetry import trace

    current_span = trace.get_current_span()
    event_detail = args['data']['eventDetail']
    notebook_state = args['data']['notebookState']
    attributes = {
        "notebookSessionId": notebook_state['sessionID'],
        'notebookPath': notebook_state['notebookPath'],
        "event": event_detail['eventName']
    }
    current_span.add_event(event_detail['eventName'], attributes=attributes)

    return {
        "exporter": args.get("id") or "OpenTelemetryExporter",
    }

default_exporters: "dict[str, Callable[[dict], dict or Awaitable[dict]]]" = {
    "console_exporter": console_exporter,
    "command_line_exporter": command_line_exporter,
    "file_exporter": file_exporter,
    "remote_exporter": remote_exporter,
    "opentelemetry_exporter": opentelemetry_exporter,
}
