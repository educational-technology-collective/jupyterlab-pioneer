import { NotebookPanel } from '@jupyterlab/notebook';

import { INotebookContent } from '@jupyterlab/nbformat';

import { requestAPI } from './handler';

export class Router {
  private sessionID?: string;
  private notebookPanel?: NotebookPanel;

  /**
   * Load notebookPanel.
   *
   * @param {NotebookPanel} notebookPanel
   */
  async loadNotebookPanel(notebookPanel: NotebookPanel) {
    this.notebookPanel = notebookPanel;
  }

  /**
   * Send event data to exporters defined in the configuration file.
   *
   * @param {Object} eventDetail An object containing event details
   * @param {Boolean} logNotebookContent A boolean indicating whether to log the entire notebook or not
   */
  async publishEvent(eventDetail: Object, logNotebookContent?: Boolean) {
    if (!this.notebookPanel) {
      throw Error('router needs to load notebookPanel first.');
    }

    // Check if session id received is equal to the stored session id
    if (
      !this.sessionID ||
      this.sessionID !== this.notebookPanel?.sessionContext.session?.id
    ) {
      this.sessionID = this.notebookPanel?.sessionContext.session?.id;
    }

    // Construct data
    const requestBody = {
      eventDetail: eventDetail,
      notebookState: {
        sessionID: this.sessionID,
        notebookPath: this.notebookPanel?.context.path,
        notebookContent: logNotebookContent
          ? (this.notebookPanel?.model?.toJSON() as INotebookContent)
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
