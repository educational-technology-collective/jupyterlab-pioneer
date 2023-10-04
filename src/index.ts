import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { INotebookContent } from '@jupyterlab/nbformat';
import { Token } from '@lumino/coreutils';
import { requestAPI } from './handler';
// import { Router } from './router';
import { producerCollection } from './producer';

const PLUGIN_ID = 'jupyterlab-pioneer:plugin';

export const IJupyterLabPioneer = new Token<IJupyterLabPioneer>(PLUGIN_ID);

// export interface IJupyterLabPioneer {
//   router: Router;
// }

// class JupyterLabPioneer implements IJupyterLabPioneer {
//   router: Router;

//   constructor() {
//     this.router = new Router();
//   }
// }

export interface IJupyterLabPioneer {
  /**
   * Send event data to exporters defined in the configuration file.
   *
   * @param {NotebookPanel} notebookPanel The notebook panel the extension currently listens to.
   * @param {Object} eventDetail An object containing event details
   * @param {Boolean} logNotebookContent A boolean indicating whether to log the entire notebook or not
   */
  publishEvent(notebookPanel: NotebookPanel, eventDetail: Object, logNotebookContent?: Boolean) : Promise<void>;
}

class JupyterLabPioneer implements IJupyterLabPioneer {
  async publishEvent(notebookPanel: NotebookPanel, eventDetail: Object, logNotebookContent?: Boolean) {
    if (!notebookPanel) {
      throw Error('router is listening to a null notebook panel');
    }
    // Construct data
    const requestBody = {
      eventDetail: eventDetail,
      notebookState: {
        sessionID: notebookPanel?.sessionContext.session?.id,
        notebookPath: notebookPanel?.context.path,
        notebookContent: logNotebookContent
          ? (notebookPanel?.model?.toJSON() as INotebookContent)
          : null // decide whether to log the entire notebook
      }
    };
    // Send data to exporters
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
  requires: [INotebookTracker],
  provides: IJupyterLabPioneer,
  activate: async (app: JupyterFrontEnd, notebookTracker: INotebookTracker) => {
    const version = await requestAPI<string>('version');
    console.log(`${PLUGIN_ID}: ${version}`);

    const config = await requestAPI<any>('config');

    const pioneer = new JupyterLabPioneer();

    notebookTracker.widgetAdded.connect(
      async (_, notebookPanel: NotebookPanel) => {
        await notebookPanel.revealed;
        await notebookPanel.sessionContext.ready;
        
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
