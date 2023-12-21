# JupyterLab Pioneer

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![PyPI](https://img.shields.io/pypi/v/jupyterlab-pioneer.svg)](https://pypi.org/project/jupyterlab-pioneer)
[![npm](https://img.shields.io/npm/v/jupyterlab-pioneer.svg)](https://www.npmjs.com/package/jupyterlab-pioneer)

A JupyterLab extension for generating and exporting JupyterLab event telemetry data.

## Get started

### Run the extension with docker compose

```bash
# enter the configuration_examples directory and run
docker compose -p jupyterlab_pioneer up --build
```

A JupyterLab application with the extension installed and configured will run on localhost:8888.

(To play with different exporter configurations, edit [Dockerfile](https://github.com/educational-technology-collective/jupyterlab-pioneer/blob/main/configuration_examples/Dockerfile#L32-L36) and run docker compose again)

### Or install the extension and configure it manually

To install the extension, execute:

```bash
pip install jupyterlab_pioneer
```

Before starting Jupyter Lab, users need to write their own configuration files (or use the provided configuration examples) and **place them in the correct directory**.

Examples of configurations are [here](#configurations).

## Configurations

### Overview

The configuration file controls the activated events and data exporters.

To add a data exporter, users should assign a callable function along with function arguments when configuring `exporters`.

This extension provides 5 default exporters.

- [`console_exporter`](https://github.com/educational-technology-collective/jupyterlab-pioneer/blob/main/jupyterlab_pioneer/default_exporters.py#L22), which sends telemetry data to the browser console
- [`command_line_exporter`](https://github.com/educational-technology-collective/jupyterlab-pioneer/blob/main/jupyterlab_pioneer/default_exporters.py#L48), which sends telemetry data to the python console jupyter is running on
- [`file_exporter`](https://github.com/educational-technology-collective/jupyterlab-pioneer/blob/main/jupyterlab_pioneer/default_exporters.py#L76), which saves telemetry data to local file
- [`remote_exporter`](https://github.com/educational-technology-collective/jupyterlab-pioneer/blob/main/jupyterlab_pioneer/default_exporters.py#L106), which sends telemetry data to a remote http endpoint
- [`opentelemetry_exporter`](https://github.com/educational-technology-collective/jupyterlab-pioneer/blob/main/jupyterlab_pioneer/default_exporters.py#L162), which sends telemetry data via otlp.

Additionally, users can write customized exporters in the configuration file.

### Configuration file name & path

Jupyter Server expects the configuration file to be named after the extension’s name like so: **`jupyter_{extension name defined in application.py}_config.py`**. So, the configuration file name for this extension is `jupyter_jupyterlab_pioneer_config.py`.

Jupyter Server looks for an extension’s config file in a set of specific paths. **The configuration file should be saved into one of the config directories provided by `jupyter --path`.**

Check jupyter server [doc](https://jupyter-server.readthedocs.io/en/latest/operators/configuring-extensions.html) for more details.

### Syntax

`activateEvents`: An array of active events. Each active event in the array should have the following structure:

```python
{
    'name': # string, event name
    'logWholeNotebook': # boolean, whether to export the entire notebook content when event is triggered
}
```

The extension would only generate and export data for valid event that has an id associated with the event class, and the event name is included in `activeEvents`.
The extension will export the entire notebook content only for valid events when the `logWholeNotebook` flag is True.

`exporters`: An array of exporters. Each exporter in the array should have the following structure:

```python
{
    'type': # One of 'console_exporter', 'command_line_exporter',
            # 'file_exporter', 'remote_exporter',
            # or 'custom_exporter'.
    'args': # Optional. Arguments passed to the exporter function.
            # It needs to contain 'path' for file_exporter, 'url' for remote_exporter.
    'activeEvents': # Optional. Exporter's local activeEvents config will override global activeEvents config
}
```

### Example

#### Default exporters

[all_exporters/jupyter_jupyterlab_pioneer_config.py](https://github.com/educational-technology-collective/jupyterlab-pioneer/blob/main/configuration_examples/all_exporters/jupyter_jupyterlab_pioneer_config.py)

#### Custom exporter function

[custom_exporter/jupyter_jupyterlab_pioneer_config.py](https://github.com/educational-technology-collective/jupyterlab-pioneer/blob/main/configuration_examples/custom_exporter/jupyter_jupyterlab_pioneer_config.py)

## Uninstall

To remove the extension, execute:

```bash
pip uninstall jupyterlab_pioneer
```

## Troubleshoot

If you are seeing the frontend extension, but it is not working, check
that the server extension is enabled:

```bash
jupyter server extension list
```

If the server extension is installed and enabled, but you are not seeing
the frontend extension, check the frontend extension is installed:

```bash
jupyter labextension list
```

## Contributing

### Development install

#### (Optional) create conda environment from the provided `environment.yml` file

```bash
conda env create -f environment.yml
```

#### Clone and build the extension package

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab-pioneer directory
# Install package in development mode
pip install -e "."
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Server extension must be manually installed in develop mode
jupyter server extension enable jupyterlab_pioneer
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
# Server extension must be manually disabled in develop mode
jupyter server extension disable jupyterlab_pioneer
pip uninstall jupyterlab_pioneer
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyterlab-pioneer` within that folder.

### Packaging the extension

See [RELEASE](RELEASE.md)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.wumengyan.com/"><img src="https://avatars.githubusercontent.com/u/85606983?v=4?s=100" width="100px;" alt="mengyanw"/><br /><sub><b>Mengyan Wu</b></sub></a><br /><a href="https://github.com/educational-technology-collective/jupyterlab-pioneer/commits?author=mengyanw" title="Code">💻</a> <a href="#ideas-mengyanw" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-mengyanw" title="Maintenance">🚧</a> <a href="#projectManagement-mengyanw" title="Project Management">📆</a> <a href="#infra-mengyanw" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/educational-technology-collective/jupyterlab-pioneer/commits?author=mengyanw" title="Tests">⚠️</a> <a href="https://github.com/educational-technology-collective/jupyterlab-pioneer/commits?author=mengyanw" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://christopherbrooks.ca"><img src="https://avatars.githubusercontent.com/u/1355641?v=4?s=100" width="100px;" alt="Christopher Brooks"/><br /><sub><b>Christopher Brooks</b></sub></a><br /><a href="#ideas-cab938" title="Ideas, Planning, & Feedback">🤔</a> <a href="#projectManagement-cab938" title="Project Management">📆</a> <a href="#infra-cab938" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://from.so/Steve_Oney"><img src="https://avatars.githubusercontent.com/u/211262?v=4?s=100" width="100px;" alt="Steve Oney"/><br /><sub><b>Steve Oney</b></sub></a><br /><a href="#ideas-soney" title="Ideas, Planning, & Feedback">🤔</a> <a href="#projectManagement-soney" title="Project Management">📆</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.chrisostrouchov.com"><img src="https://avatars.githubusercontent.com/u/1740337?v=4?s=100" width="100px;" alt="Christopher Ostrouchov"/><br /><sub><b>Christopher Ostrouchov</b></sub></a><br /><a href="#ideas-costrouc" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/educational-technology-collective/jupyterlab-pioneer/commits?author=costrouc" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://iamit.in"><img src="https://avatars.githubusercontent.com/u/5647941?v=4?s=100" width="100px;" alt="Amit Kumar"/><br /><sub><b>Amit Kumar</b></sub></a><br /><a href="#infra-aktech" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
