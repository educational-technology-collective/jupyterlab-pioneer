Architecture
============

.. mermaid::
    :zoom:
    
    sequenceDiagram
      actor U as User
      participant C as Client extension <br> (Browser)
      participant S as Server extension <br> (Python kernel)
      participant E as console, command line, local file or http endpoint

      C->>S: Request global configuration
      S->>C: Send global configuration file content
      Note over C: Parse exporter and active events configuration, <br> override global configuration if notebook's <br> metadata contains local configuration.
      Note over C, S: Extension activated
      activate U
      U->>C: Interact with Jupyter Lab, <br> trigger events
      C->>S: Send event data & exporter info
      activate E
      S->>E: Export event data <br> based on exporter info
      S->>C: Send exporter's response message
      deactivate U
      deactivate E