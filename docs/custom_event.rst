How to implement a custom event extension
===========================================

Set up development environment
------------------------------
::

    conda create -n custom_event_ext_env --override-channels --strict-channel-priority -c conda-forge -c nodefaults jupyterlab=4 nodejs=18 copier=8 jinja2-time jupyter-packaging git

    conda activate custom_event_ext_env


Implement the extension from scratch
------------------------------------

Initialize from the extension template

::

    mkdir jupyterlab-pioneer-custom-event-demo

    cd jupyterlab-pioneer-custom-event-demo

    copier copy --UNSAFE https://github.com/jupyterlab/extension-template .

Add ``jupyterlab-pioneer`` as a dependency in ``pyproject.toml`` and ``package.json``.

.. code-block:: toml

    dependencies = [
        "jupyter_server>=2.0.1,<3",
        "jupyterlab-pioneer"
    ]

.. code-block::

    "jupyterlab": {
        ...
        "sharedPackages": {
            "jupyterlab-pioneer": {
                "bundled": false,
                "singleton": true,
                "strictVersion": true
            }
        }
    },

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
yarn that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.
::

    # Install package in development mode
    pip install -e "."
    # Link your development version of the extension with JupyterLab
    jupyter labextension develop . --overwrite
    # Server extension must be manually installed in develop mode
    jupyter server extension enable jupyterlab-pioneer-custom-event-demo
    # Rebuild extension Typescript source after making changes
    jlpm build


You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.
::

    # Watch the source directory in one terminal, automatically rebuilding when needed
    jlpm watch
    # Run JupyterLab in another terminal
    jupyter lab


Implement the extension based on the demo extension
--------------------------------------------------------

::

    # Clone the repo to your local environment
    git clone https://github.com/educational-technology-collective/jupyterlab-pioneer-custom-event-demo
    # Change directory to the jupyterlab-pioneer-custom-event-demo directory
    cd jupyterlab-pioneer-custom-event-demo
    # Install package in development mode
    pip install -e "."
    # Link your development version of the extension with JupyterLab
    jupyter labextension develop . --overwrite
    # Server extension must be manually installed in develop mode
    jupyter server extension enable jupyterlab-pioneer-custom-event-demo
    # Rebuild extension Typescript source after making changes
    jlpm build
    # Or watch the source directory in one terminal, automatically rebuilding when needed
    jlpm watch
    # Run JupyterLab in another terminal
    jupyter lab

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command::

    jupyter lab build --minimize=False

Development Workflow
--------------------

Client Side

- Make changes to the TypeScript client extension.
- Refresh the browser.
- Observe the changes in the running application.

Server Side

- Make changes to the Python server extension.
- Stop the Jupyter server.
- Start the Jupyter server.
- Observe the changes in the running application.

Useful links

https://jupyterlab.readthedocs.io/en/stable/extension/extension_tutorial.html

https://jupyter-server.readthedocs.io/en/latest/operators/configuring-extensions.html

https://github.com/educational-technology-collective/jupyterlab-pioneer


How to utilize the ``jupyter-pioneer`` extension to export telemetry data
--------------------------------------------------------------------------

The ``jupyter-pioneer`` extension helps to monitor notebook states and export telemetry data. It also provides a basic JupyterLab events library.

The extension's router provides the ``publishEvent`` method.

``publishEvent`` could be called whenever we want to publish the event and export telemetry data to the desired endpoints. The `publishEvent` method takes 4 arguments, `notebookPanel`, `eventDetail`, `exporter` and `logWholeNotebook`.

There is generally no limitation on the structure of the `eventDetail` object, as long as the information is wrapped in a serializable javascript object. `logWholeNotebook` is optional and should be a `Boolean` object. Only if it is provided and is `true`, the router will send out the entire notebook content along with the event data.

When `publishEvent` is called, the extension inserts the notebook session ID, notebook file path, and the notebook content (when `logWholeNotebook` is `true`) into the data. Then, it checks the exporter info, processes and sends out the data to the specified exporter. If `env` and `params` are provided in the configuration file when defining the desired exporter, the router would extract the environment variables and add the params to the exported data. Finally, the router will assemble the responses from the exporters in an array and print the response array in the console.

**(Optional) Event Producer**

There is no specific restrictions on when and where the telemetry router should be invoked. However, when writing complex event producer libraries, we recommend developers write an event producer class for each event, implement a `listen()` class method, and call the producer's `listen()` method when the producer extension is being activated. Within the `listen()` method, you may write the logic of how the extension listens to Jupyter signals or DOM events and how to use the `pioneer.publishEvent()` function to export telemetry data.

**(Optional) Producer Configuration**

Writing code on top of the configuration file might be very useful when the event library is complex, and when the telemetry system is going to be deployed under different contexts with different needs of telemetry events.

For more details, see https://jupyter-server.readthedocs.io/en/latest/operators/configuring-extensions.html.