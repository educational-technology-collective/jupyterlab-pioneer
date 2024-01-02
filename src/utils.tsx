import * as React from 'react';
import { Dialog, showDialog, Notification } from '@jupyterlab/apputils';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { Exporter } from './types';

export const sendInfoNotification = (
  exporters: Exporter[],
  isGlobal: boolean
) => {
  const exporterMessage = exporters
    .map(each => each.args?.id || each.type)
    .join(' & ');
  let message;
  if (isGlobal && exporterMessage) {
    message = `Telemetry data is being logged to ${exporterMessage} through jupyterlab-pioneer. \n See Help menu -> JupyterLab Pioneer for more details.`;
  } else if (isGlobal && !exporterMessage) {
    message = `Telemetry data is being logged through jupyterlab-pioneer. \n See Help menu -> JupyterLab Pioneer for more details.`;
  } else {
    message = `Embedded telemetry settings loaded. Telemetry data is being logged to ${exporterMessage} now.`;
  }
  Notification.info(message, { autoClose: 20000 });
};

export const addInfoToHelpMenu = (
  app: JupyterFrontEnd,
  mainMenu: IMainMenu,
  version: string
) => {
  // Add extension info to help menu
  app.commands.addCommand('help:pioneer', {
    label: 'JupyterLab Pioneer',
    execute: () => {
      // Create the header of the dialog
      const title = (
        <span className="jp-About-header">
          JupyterLab Pioneer
          <div className="jp-About-header-info">
            <span className="jp-About-version-info">
              <span className="jp-About-version">Version {version}</span>
            </span>
          </div>
        </span>
      );

      // Create the body of the dialog
      const contributorsURL =
        'https://github.com/educational-technology-collective/jupyterlab-pioneer/graphs/contributors';
      const docURL = 'https://jupyterlab-pioneer.readthedocs.io/en/latest/';
      const gitURL =
        'https://github.com/educational-technology-collective/jupyterlab-pioneer';
      const externalLinks = (
        <span className="jp-About-externalLinks">
          <a
            href={contributorsURL}
            target="_blank"
            rel="noopener noreferrer"
            className="jp-Button-flat"
          >
            CONTRIBUTOR LIST
          </a>
          <a
            href={docURL}
            target="_blank"
            rel="noopener noreferrer"
            className="jp-Button-flat"
          >
            DOCUMENTATION
          </a>
          <a
            href={gitURL}
            target="_blank"
            rel="noopener noreferrer"
            className="jp-Button-flat"
          >
            GITHUB REPO
          </a>
        </span>
      );
      const copyright = (
        <span className="jp-About-copyright">
          © 2023 Educational Technology Collective
        </span>
      );
      const body = (
        <div className="jp-About-body">
          {externalLinks}
          {copyright}
        </div>
      );

      return showDialog({
        title,
        body,
        buttons: [
          Dialog.createButton({
            label: 'Dismiss',
            className: 'jp-About-button jp-mod-reject jp-mod-styled'
          })
        ]
      });
    }
  });

  mainMenu.helpMenu.addGroup([{ command: 'help:pioneer' }]);
};
