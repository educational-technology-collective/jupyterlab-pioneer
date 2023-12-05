Configuration
==============

Overview
------------

The configuration file controls the activated events and data exporters.

This extension provides 5 default exporters in the :mod:`.default_exporters` module:

1. :func:`.default_exporters.console_exporter`, which sends telemetry data to the browser console.

2. :func:`.default_exporters.command_line_exporter`, which sends telemetry data to the python console jupyter is running on.

3. :func:`.default_exporters.file_exporter`, which saves telemetry data to local file.

4. :func:`.default_exporters.remote_exporter`, which sends telemetry data to a remote http endpoint.

5. :func:`.default_exporters.opentelemetry_exporter`, which sends telemetry data via otlp.

Default exporters will be activated if the exporter name is included by the configuration file.

Additionally, users can write custom exporters in the configuration file.

Configuration file name & path
------------------------------

Jupyter Server expects the configuration file to be named after the extension's name like so: `jupyter_{extension name defined in application.py}_config.py`. So, the configuration file name for this extension is ``jupyter_jupyterlab_pioneer_config.py``.

Jupyter Server looks for an extension's config file in a set of specific paths. **The configuration file should be saved into one of the config directories provided by** ``jupyter --path``.

Check `jupyter server documentation <https://jupyter-server.readthedocs.io/en/latest/operators/configuring-extensions.html>`_ for more details.

Syntax
------

* ``activateEvents``
    An array of active events. Each active event in the array should have the following structure:
    ::

        {
            'name': # string, event name
            'logWholeNotebook': # boolean, whether to export the entire notebook content when event is triggered
        }

    The extension would only generate and export data for valid event that:

        1. has an id associated with the event class, 
        2. and the event name is included in ``activeEvents``.

    The extension will export the entire notebook content only for valid events with the ``logWholeNotebook`` flag is ``True``.

    Example::
        
        c.JupyterLabPioneerApp.activeEvents = [
            {"name": "ActiveCellChangeEvent", "logWholeNotebook": False},
            {"name": "CellAddEvent", "logWholeNotebook": False},
            {"name": "CellExecuteEvent", "logWholeNotebook": False},
            {"name": "CellRemoveEvent", "logWholeNotebook": False},
        ]

* ``exporters``
    An array of exporters. Each exporter in the array should have the following structure:
    ::

        {
            'type': # One of 'console_exporter', 'command_line_exporter',
                    # 'file_exporter', 'remote_exporter',
                    # or 'custom_exporter'.
            'args': # Optional. Arguments passed to the exporter function.
                    # It needs to contain 'path' for file_exporter, 'url' for remote_exporter.
            'activeEvents': # Optional. Exporter's local activeEvents config will override global activeEvents config
        }
    
    Example::

        c.JupyterLabPioneerApp.exporters = [
            {
                # sends telemetry data to the browser console
                "type": "console_exporter",
            },
            {
                # sends telemetry data to the python console jupyter is running on
                "type": "command_line_exporter",
            },
            {
                # writes telemetry data to local file
                "type": "file_exporter",
                "args": {
                    "path": "log"
                },
            },
            {
                # sends telemetry data to a remote http endpoint (AWS S3 bucket)
                "type": "remote_exporter",
                "args": {
                    "id": "S3Exporter",
                    "url": "https://telemetry.mentoracademy.org/telemetry-edtech-labs-si-umich-edu/dev/test-telemetry",
                    "env": ["WORKSPACE_ID"],
                },
            },
        ]

* ``custom_exporter``
    (Optional) A dictionary of custom exporter. 
    
    It is accessed only when the ``exporter`` config contains an exporter with ``"type": "custom_exporter"``. If the ``exporters.args.id`` matches one of the key in the dictionary, then the corresponding custom exporter function will be called.
        
    Example::
        
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


Complete Examples
-----------------

`Default exporters`_

.. _Default exporters: https://github.com/educational-technology-collective/jupyterlab-pioneer/blob/main/configuration_examples/all_exporters/jupyter_jupyterlab_pioneer_config.py

`Custom exporter`_

.. _Custom exporter: https://github.com/educational-technology-collective/jupyterlab-pioneer/blob/main/configuration_examples/custom_exporter/jupyter_jupyterlab_pioneer_config.py