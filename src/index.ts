import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { Token } from '@lumino/coreutils';
import { requestAPI } from './handler';
import { Router } from './router';
import { producerCollection } from './producer';

const PLUGIN_ID = 'jupyterlab-pioneer:plugin';

export const IJupyterLabPioneer = new Token<IJupyterLabPioneer>(PLUGIN_ID);
export interface IJupyterLabPioneer {
  router: Router;
}

class JupyterLabPioneer implements IJupyterLabPioneer {
  router: Router;

  constructor() {
    this.router = new Router();
  }
}

const plugin: JupyterFrontEndPlugin<JupyterLabPioneer> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [INotebookTracker],
  provides: IJupyterLabPioneer,
  activate: async (app: JupyterFrontEnd, notebookTracker: INotebookTracker) => {
    const version = await requestAPI<string>('version');
    console.log(`${PLUGIN_ID}: ${version}`);

    const config = await requestAPI<any>('config');

    const pioneer = new JupyterLabPioneer();

    notebookTracker.widgetAdded.connect(
      async (_, notebookPanel: NotebookPanel) => {
        await notebookPanel.sessionContext.ready; // wait until session id is created
        await pioneer.router.loadNotebookPanel(notebookPanel);

        producerCollection.forEach(producer => {
          if (config.activeEvents.includes(producer.id)) {
            new producer().listen(
              notebookPanel,
              pioneer,
              config.logNotebookContentEvents.includes(producer.id)
            );
          }
        });
      }
    );

    return pioneer;
  }
};

export default plugin;
