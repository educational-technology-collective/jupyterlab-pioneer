# Use python 3.11.5-slim as base image
ARG PYTHON_VERSION=3.11.5
FROM python:${PYTHON_VERSION}-slim as base

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

# Prevent the pipeline from succeeding if any of the commands fail
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Set user to root
USER root

# Install dependencies
RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    curl \
    gcc \
    python3-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN python3.11 -m pip install --no-cache-dir --upgrade pip \
    && python3.11 -m pip install -U setuptools \
    && python3.11 -m pip install jupyterlab \
    && python3.11 -m pip install -U jupyterlab-pioneer

# Copy the jupyterlab-pioneer configuration example file to one of the jupyter config directories
COPY all_exporters/jupyter_jupyterlab_pioneer_config.py /etc/jupyter/
# COPY console_exporter/jupyter_jupyterlab_pioneer_config.py /etc/jupyter/
# COPY file_exporter/jupyter_jupyterlab_pioneer_config.py /etc/jupyter/
# COPY remote_exporter/jupyter_jupyterlab_pioneer_config.py /etc/jupyter/
# COPY custom_exporter/jupyter_jupyterlab_pioneer_config.py /etc/jupyter/

# Run jupyter lab, give access to all ips so that jupyter lab could be accessed outside of the docker container, disable browser and allow root access
CMD ["jupyter-lab","--ip=0.0.0.0","--no-browser","--allow-root"]
