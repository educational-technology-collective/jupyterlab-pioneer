import {
  Notebook,
  NotebookPanel,
  NotebookActions,
  KernelError
} from '@jupyterlab/notebook';
import { Cell, ICellModel } from '@jupyterlab/cells';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { IObservableList } from '@jupyterlab/observables';
import { IJupyterLabPioneer } from './index';
import { requestAPI } from './handler';

export class NotebookOpenEventProducer {
  static id: string = 'NotebookOpenEvent';
  private produced: boolean = false;

  async listen(
    _: NotebookPanel,
    pioneer: IJupyterLabPioneer,
    logNotebookContentEvent: boolean
  ) {
    if (!this.produced) {
      const event = {
        eventName: NotebookOpenEventProducer.id,
        eventTime: Date.now(),
        eventInfo: {
          environ: await requestAPI<any>('environ')
        }
      };
      await pioneer.router.publishEvent(event, logNotebookContentEvent);
      this.produced = true;
    }
  }
}

const getVisibleCells = (notebookPanel: NotebookPanel) => {
  const visibleCells: Array<any> = [];

  for (let index = 0; index < notebookPanel.content.widgets.length; index++) {
    const cell = notebookPanel.content.widgets[index];

    const cellTop = cell.node.offsetTop;
    const cellBottom = cell.node.offsetTop + cell.node.offsetHeight;
    const viewTop = notebookPanel.content.node.scrollTop;
    const viewBottom =
      notebookPanel.content.node.scrollTop +
      notebookPanel.content.node.clientHeight;

    if (cellTop <= viewBottom && cellBottom >= viewTop) {
      visibleCells.push({
        id: cell.model.id,
        index: index
      });
    }
  }

  return visibleCells;
};

export class NotebookScrollProducer {
  static id: string = 'NotebookScrollEvent';
  private timeout = 0;

  listen(
    notebookPanel: NotebookPanel,
    pioneer: IJupyterLabPioneer,
    logNotebookContentEvent: boolean
  ) {
    notebookPanel.content.node.addEventListener('scroll', async (e: Event) => {
      e.stopPropagation();
      clearTimeout(this.timeout);
      await new Promise(
        resolve => (this.timeout = window.setTimeout(resolve, 1500))
      ); // wait 1.5 seconds before preceding
      const event = {
        eventName: NotebookScrollProducer.id,
        eventTime: Date.now(),
        eventInfo: {
          cells: getVisibleCells(notebookPanel)
        }
      };
      await pioneer.router.publishEvent(event, logNotebookContentEvent);
    });
  }
}

export class NotebookVisibleEventProducer {
  static id: string = 'NotebookVisibleEvent';

  listen(
    notebookPanel: NotebookPanel,
    pioneer: IJupyterLabPioneer,
    logNotebookContentEvent: boolean
  ) {
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        const event = {
          eventName: NotebookVisibleEventProducer.id,
          eventTime: Date.now(),
          eventInfo: {
            cells: getVisibleCells(notebookPanel)
          }
        };
        await pioneer.router.publishEvent(event, logNotebookContentEvent);
      }
    });
  }
}

export class NotebookHiddenEventProducer {
  static id: string = 'NotebookHiddenEvent';

  listen(
    _: NotebookPanel,
    pioneer: IJupyterLabPioneer,
    logNotebookContentEvent: boolean
  ) {
    document.addEventListener('visibilitychange', async (e: Event) => {
      if (document.visibilityState === 'hidden') {
        const event = {
          eventName: NotebookHiddenEventProducer.id,
          eventTime: Date.now()
        };
        await pioneer.router.publishEvent(event, logNotebookContentEvent);
      }
    });
  }
}

export class ClipboardCopyEventProducer {
  static id: string = 'ClipboardCopyEvent';

  listen(
    notebookPanel: NotebookPanel,
    pioneer: IJupyterLabPioneer,
    logNotebookContentEvent: boolean
  ) {
    notebookPanel.node.addEventListener('copy', async () => {
      const cell = {
        id: notebookPanel.content.activeCell?.model.id,
        index: notebookPanel.content.widgets.findIndex(
          value => value === notebookPanel.content.activeCell
        )
      };
      const text = document.getSelection()?.toString();
      const event = {
        eventName: ClipboardCopyEventProducer.id,
        eventTime: Date.now(),
        eventInfo: {
          cells: [cell],
          selection: text
        }
      };
      await pioneer.router.publishEvent(event, logNotebookContentEvent);
    });
  }
}
export class ClipboardCutEventProducer {
  static id: string = 'ClipboardCutEvent';

  listen(
    notebookPanel: NotebookPanel,
    pioneer: IJupyterLabPioneer,
    logNotebookContentEvent: boolean
  ) {
    notebookPanel.node.addEventListener('cut', async () => {
      const cell = {
        id: notebookPanel.content.activeCell?.model.id,
        index: notebookPanel.content.widgets.findIndex(
          value => value === notebookPanel.content.activeCell
        )
      };
      const text = document.getSelection()?.toString();
      const event = {
        eventName: ClipboardCutEventProducer.id,
        eventTime: Date.now(),
        eventInfo: {
          cells: [cell],
          selection: text
        }
      };
      await pioneer.router.publishEvent(event, logNotebookContentEvent);
    });
  }
}
export class ClipboardPasteEventProducer {
  static id: string = 'ClipboardPasteEvent';

  listen(
    notebookPanel: NotebookPanel,
    pioneer: IJupyterLabPioneer,
    logNotebookContentEvent: boolean
  ) {
    notebookPanel.node.addEventListener('paste', async (e: ClipboardEvent) => {
      const cell = {
        id: notebookPanel.content.activeCell?.model.id,
        index: notebookPanel.content.widgets.findIndex(
          value => value === notebookPanel.content.activeCell
        )
      };
      const text = (e.clipboardData || (window as any).clipboardData).getData(
        'text'
      );
      const event = {
        eventName: ClipboardPasteEventProducer.id,
        eventTime: Date.now(),
        eventInfo: {
          cells: [cell],
          selection: text
        }
      };
      await pioneer.router.publishEvent(event, logNotebookContentEvent);
    });
  }
}

export class ActiveCellChangeEventProducer {
  static id: string = 'ActiveCellChangeEvent';

  listen(
    notebookPanel: NotebookPanel,
    pioneer: IJupyterLabPioneer,
    logNotebookContentEvent: boolean
  ) {
    notebookPanel.content.activeCellChanged.connect(
      async (_, cell: Cell<ICellModel> | null) => {
        if (cell && notebookPanel.content.widgets) {
          const activatedCell = {
            id: cell?.model.id,
            index: notebookPanel.content.widgets.findIndex(
              value => value === cell
            )
          };
          const event = {
            eventName: ActiveCellChangeEventProducer.id,
            eventTime: Date.now(),
            eventInfo: {
              cells: [activatedCell] // activated cell
            }
          };
          await pioneer.router.publishEvent(event, logNotebookContentEvent);
        }
      }
    );
  }
}

export class NotebookSaveEventProducer {
  static id: string = 'NotebookSaveEvent';

  listen(
    notebookPanel: NotebookPanel,
    pioneer: IJupyterLabPioneer,
    logNotebookContentEvent: boolean
  ) {
    notebookPanel.context.saveState.connect(
      async (_, saveState: DocumentRegistry.SaveState) => {
        if (saveState.match('completed')) {
          const event = {
            eventName: NotebookSaveEventProducer.id,
            eventTime: Date.now()
          };
          await pioneer.router.publishEvent(event, logNotebookContentEvent);
        }
      }
    );
  }
}

export class CellExecuteEventProducer {
  static id: string = 'CellExecuteEvent';

  listen(
    _: any,
    pioneer: IJupyterLabPioneer,
    logNotebookContentEvent: boolean
  ) {
    NotebookActions.executed.connect(
      async (
        _: any,
        args: {
          notebook: Notebook;
          cell: Cell<ICellModel>;
          success: Boolean;
          error?: KernelError | null | undefined;
        }
      ) => {
        const executedCell = {
          id: args.cell.model.id,
          index: args.notebook.widgets.findIndex(value => value == args.cell)
        };
        const event = {
          eventName: CellExecuteEventProducer.id,
          eventTime: Date.now(),
          eventInfo: {
            cells: [executedCell],
            success: args.success,
            kernelError: args.success ? null : args.error
          }
        };
        await pioneer.router.publishEvent(event, logNotebookContentEvent);
      }
    );
  }
}

export class CellAddEventProducer {
  static id: string = 'CellAddEvent';

  listen(
    notebookPanel: NotebookPanel,
    pioneer: IJupyterLabPioneer,
    logNotebookContentEvent: boolean
  ) {
    notebookPanel.content.model?.cells.changed.connect(
      async (_, args: IObservableList.IChangedArgs<ICellModel>) => {
        if (args.type === 'add') {
          const addedCell = {
            id: args.newValues[0].id,
            index: args.newIndex
          };
          const event = {
            eventName: CellAddEventProducer.id,
            eventTime: Date.now(),
            eventInfo: {
              cells: [addedCell]
            }
          };
          await pioneer.router.publishEvent(event, logNotebookContentEvent);
        }
      }
    );
  }
}

export class CellRemoveEventProducer {
  static id: string = 'CellRemoveEvent';

  listen(
    notebookPanel: NotebookPanel,
    pioneer: IJupyterLabPioneer,
    logNotebookContentEvent: boolean
  ) {
    notebookPanel.content.model?.cells.changed.connect(
      async (_, args: IObservableList.IChangedArgs<ICellModel>) => {
        if (args.type === 'remove') {
          const removedCell = {
            newIndex: args.newIndex,
            oldIndex: args.oldIndex
          };
          const event = {
            eventName: CellRemoveEventProducer.id,
            eventTime: Date.now(),
            eventInfo: {
              cells: [removedCell]
            }
          };
          await pioneer.router.publishEvent(event, logNotebookContentEvent);
        }
      }
    );
  }
}

export const producerCollection = [
  NotebookOpenEventProducer,
  NotebookScrollProducer,
  NotebookVisibleEventProducer,
  NotebookHiddenEventProducer,
  ClipboardCopyEventProducer,
  ClipboardCutEventProducer,
  ClipboardPasteEventProducer,
  ActiveCellChangeEventProducer,
  NotebookSaveEventProducer,
  CellExecuteEventProducer,
  CellAddEventProducer,
  CellRemoveEventProducer
];
