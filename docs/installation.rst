Installation
============

Install
--------

To install the extension, execute::

Using pip::

    pip install jupyterlab_pioneer

Using conda (via conda-forge)::

    conda install -c conda-forge jupyterlab-pioneer

Before starting Jupyter Lab, users need to write their own configuration files (or use the `provided configuration examples <https://github.com/educational-technology-collective/jupyterlab-pioneer/tree/main/configuration_examples>`_) and place them in the `correct directory`_.

Documentation on how to write configuration files is here_.

.. _correct directory: configuration.html#configuration-file-name-path
.. _here: configuration.html

Uninstall
---------

To remove the extension, execute::

Using pip::

    pip uninstall jupyterlab_pioneer

Using conda::

   conda uninstall jupyterlab-pioneer

Troubleshoot
------------

If you are seeing the frontend extension, but it is not working, check
that the server extension is enabled::

    jupyter server extension list

If the server extension is installed and enabled, but you are not seeing
the frontend extension, check the frontend extension is installed::

    jupyter labextension list
