import { NotebookPanel } from '@jupyterlab/notebook';

import { INotebookContent } from '@jupyterlab/nbformat';

import { requestAPI } from './handler';

export class Router {
  /**
   * Send event data to exporters defined in the configuration file.
   *
   * @param {NotebookPanel} notebookPanel The notebook panel the extension currently listens to.
   * @param {Object} eventDetail An object containing event details
   * @param {Boolean} logNotebookContent A boolean indicating whether to log the entire notebook or not
   */
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
