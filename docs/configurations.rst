Configurations
==============

Overview
------------

The configuration file controls the activated events and data exporters.

To add a data exporter, users should assign a callable function along with function arguments when configuring `exporters`.

This extension provides 4 default exporters in the :mod:`.default_exporters` module:

:func:`.default_exporters.console_exporter`, which sends telemetry data to the browser console.

:func:`.default_exporters.command_line_exporter`, which sends telemetry data to the python console jupyter is running on.

:func:`.default_exporters.file_exporter`, which saves telemetry data to local file.

:func:`.default_exporters.remote_exporter`, which sends telemetry data to a remote http endpoint.

Additionally, users can import default exporters or write customized exporters in the configuration file.

Configuration file name & path
------------------------------

Jupyter Server expects the configuration file to be named after the extension's name like so: **`jupyter_{extension name defined in application.py}_config.py`**. So, the configuration file name for this extension is `jupyter_jupyterlab_pioneer_config.py`.

Jupyter Server looks for an extension's config file in a set of specific paths. **The configuration file should be saved into one of the config directories provided by `jupyter --path`.**

Check jupyter server doc_ for more details.

.. _doc: https://jupyter-server.readthedocs.io/en/latest/operators/configuring-extensions.html

Syntax
------

`activateEvents`: An array of active events. Each active event in the array should have the following structure:
::

    {
        'name': # string, event name
        'logWholeNotebook': # boolean, whether to export the entire notebook content when event is triggered
    }

The extension would only generate and export data for valid events ( 1. that have an id associated with the event class, 2. and the event name is included in `activeEvents`).
The extension will export the entire notebook content only for valid events with the `logWholeNotebook` flag == True.

`exporters`: An array of exporters. Each exporter in the array should have the following structure:
::

    {
        'type': # One of 'console_exporter', 'command_line_exporter',
                # 'file_exporter', 'remote_exporter',
                # or 'custom_exporter'.
        'args': # Optional. Arguments passed to the exporter function.
                # It needs to contain 'path' for file_exporter, 'url' for remote_exporter.
        'activeEvents': # Optional. Exporter's local activeEvents config will override global activeEvents config
    }

Example
-------

`Default exporters`_

.. _Default exporters: https://github.com/educational-technology-collective/jupyterlab-pioneer/blob/main/configuration_examples/all_exporters/jupyter_jupyterlab_pioneer_config.py

`Custom exporter function`_

.. _Custom exporter function: https://github.com/educational-technology-collective/jupyterlab-pioneer/blob/main/configuration_examples/custom_exporter/jupyter_jupyterlab_pioneer_config.py