Get started
===========

Run the extension with docker compose
-------------------------------------
::

    # enter the configuration_examples directory and run
    docker compose -p jupyterlab_pioneer up --build

A JupyterLab application with the extension installed and configured will run on localhost:8888.

(To play with different exporter configurations, edit Dockerfile and run docker compose again)

Or install the extension and configure it manually
--------------------------------------------------

To install the extension, execute::

    pip install jupyterlab_pioneer

Before starting Jupyter Lab, users need to write their own configuration files (or use the provided configuration examples) and **place them in the correct directory**.

Examples of configurations are here_.

.. _here: configurations.html


Uninstall
---------

To remove the extension, execute::

    pip uninstall jupyterlab_pioneer


Troubleshoot
------------

If you are seeing the frontend extension, but it is not working, check
that the server extension is enabled::

    jupyter server extension list

If the server extension is installed and enabled, but you are not seeing
the frontend extension, check the frontend extension is installed::

    jupyter labextension list


