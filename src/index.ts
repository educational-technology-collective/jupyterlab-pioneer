import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

/**
 * Initialization data for the jupyterlab-telemetry-system extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-telemetry-system:plugin',
  description: 'A JupyterLab extension.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-telemetry-system is activated!');

    requestAPI<any>('get-example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterlab_telemetry_system server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;
