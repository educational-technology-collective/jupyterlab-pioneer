import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { INotebookContent } from '@jupyterlab/nbformat';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { Notification } from '@jupyterlab/apputils';
import { Token } from '@lumino/coreutils';
import { requestAPI } from './handler';
import { producerCollection } from './producer';
import { ActiveEvent, Config, Exporter } from './types';
import { sendInfoNotification, addInfoToHelpMenu } from './utils';

const PLUGIN_ID = 'jupyterlab-pioneer:plugin';

export const IJupyterLabPioneer = new Token<IJupyterLabPioneer>(PLUGIN_ID);

export interface IJupyterLabPioneer {
  /**
   * Send event data to exporters defined in the configuration file.
   *
   * @param {NotebookPanel} notebookPanel The notebook panel the extension currently listens to.
   * @param {Object} eventDetail An object containing event details.
   * @param {Exporter} exporter The exporter configuration.
   * @param {Boolean=} logWholeNotebook A boolean indicating whether to log the entire notebook or not.
   */
  publishEvent(
    notebookPanel: NotebookPanel,
    eventDetail: Object,
    exporter: Exporter,
    logWholeNotebook?: Boolean
  ): Promise<void>;
}

class JupyterLabPioneer implements IJupyterLabPioneer {
  async publishEvent(
    notebookPanel: NotebookPanel,
    eventDetail: Object,
    exporter: Exporter,
    logWholeNotebook?: Boolean
  ) {
    if (!notebookPanel) {
      throw Error('router is listening to a null notebook panel');
    }
    const requestBody = {
      eventDetail: eventDetail,
      notebookState: {
        sessionID: notebookPanel?.sessionContext.session?.id,
        notebookPath: notebookPanel?.context.path,
        notebookContent: logWholeNotebook
          ? (notebookPanel?.model?.toJSON() as INotebookContent)
          : null // decide whether to log the entire notebook
      },
      exporter: exporter
    };
    const response = await requestAPI<any>('export', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    console.log(response);
  }
}

const plugin: JupyterFrontEndPlugin<JupyterLabPioneer> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [INotebookTracker, IMainMenu],
  provides: IJupyterLabPioneer,
  activate: async (
    app: JupyterFrontEnd,
    notebookTracker: INotebookTracker,
    mainMenu: IMainMenu
  ) => {
    const version = await requestAPI<string>('version');
    console.log(`${PLUGIN_ID}: ${version}`);

    const config = (await requestAPI<any>('config')) as Config;

    const pioneer = new JupyterLabPioneer();

    addInfoToHelpMenu(app, mainMenu, version);
    sendInfoNotification(config.exporters, true);

    notebookTracker.widgetAdded.connect(
      async (_, notebookPanel: NotebookPanel) => {
        await notebookPanel.revealed;
        await notebookPanel.sessionContext.ready;

        const activeEvents: ActiveEvent[] = config.activeEvents;
        const exporters: Exporter[] =
          notebookPanel.content.model?.getMetadata('exporters') ||
          config.exporters; // The exporters configuration in the notebook metadata overrides the configuration in the configuration file "jupyter_jupyterlab_pioneer_config.py"

        const processedExporters =
          activeEvents && activeEvents.length
            ? exporters.map(e => {
                if (!e.activeEvents) {
                  e.activeEvents = activeEvents;
                  return e;
                } else {
                  return e;
                }
              })
            : exporters.filter(e => e.activeEvents && e.activeEvents.length);
        // Exporters without specifying the corresponding activeEvents will use the global activeEvents configuration.
        // When the global activeEvents configuration is null, exporters that do not have corresponding activeEvents will be ignored.
        console.log(processedExporters);

        processedExporters.forEach(exporter => {
          producerCollection.forEach(producer => {
            if (exporter.activeEvents?.map(o => o.name).includes(producer.id)) {
              new producer().listen(notebookPanel, pioneer, exporter);
            }
          });
        });

        if (notebookPanel.content.model?.getMetadata('exporters')) {
          sendInfoNotification(processedExporters, false);
        }
      }
    );

    return pioneer;
  }
};

export default plugin;
