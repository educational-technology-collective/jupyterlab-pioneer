ARG PYTHON_VERSION=3.11.5
FROM python:${PYTHON_VERSION}-slim as base

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

USER root

RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    curl \
    gcc \
    python3-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN python3.11 -m pip install --no-cache-dir --upgrade pip \
    && python3.11 -m pip install -U setuptools \
    && python3.11 -m pip install jupyterlab jupyterlab-telemetry-system

COPY jupyter_jupyterlab_telemetry_system_config.py /etc/jupyter/

CMD ["jupyter-lab","--ip=0.0.0.0","--no-browser","--allow-root"]
