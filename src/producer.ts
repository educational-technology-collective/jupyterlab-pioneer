import {
  Notebook,
  NotebookPanel,
  NotebookActions,
  KernelError
} from '@jupyterlab/notebook';
import { Cell, ICellModel } from '@jupyterlab/cells';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { IObservableList } from '@jupyterlab/observables';
import { CodeMirrorEditor } from '@jupyterlab/codemirror';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { IJupyterLabPioneer } from './index';
import { requestAPI } from './handler';

export class ActiveCellChangeEventProducer {
  static id: string = 'ActiveCellChangeEvent';

  listen(notebookPanel: NotebookPanel, pioneer: IJupyterLabPioneer) {
    notebookPanel.content.activeCellChanged.connect(
      async (_, cell: Cell<ICellModel> | null) => {
        if (cell && notebookPanel.content.widgets) {
          const activatedCell = {
            id: cell?.model.id,
            index: notebookPanel.content.widgets.findIndex(
              value => value === cell
            ),
            type: cell?.model.type
          };
          const event = {
            eventName: ActiveCellChangeEventProducer.id,
            eventTime: Date.now(),
            eventInfo: {
              cells: [activatedCell] // activated cell
            }
          };
          pioneer.exporters.forEach(async exporter => {
            if (
              exporter.activeEvents
                ?.map(o => o.name)
                .includes(ActiveCellChangeEventProducer.id)
            ) {
              await pioneer.publishEvent(
                notebookPanel,
                event,
                exporter,
                exporter.activeEvents?.find(
                  o => o.name == ActiveCellChangeEventProducer.id
                )?.logWholeNotebook
              );
            }
          });
        }
      }
    );
  }
}

export class CellAddEventProducer {
  static id: string = 'CellAddEvent';

  listen(notebookPanel: NotebookPanel, pioneer: IJupyterLabPioneer) {
    notebookPanel.content.model?.cells.changed.connect(
      async (_, args: IObservableList.IChangedArgs<ICellModel>) => {
        if (args.type === 'add') {
          const addedCell = {
            id: args.newValues[0].id,
            index: args.newIndex,
            type: args.newValues[0].type
          };
          const event = {
            eventName: CellAddEventProducer.id,
            eventTime: Date.now(),
            eventInfo: {
              cells: [addedCell]
            }
          };
          pioneer.exporters.forEach(async exporter => {
            if (
              exporter.activeEvents
                ?.map(o => o.name)
                .includes(CellAddEventProducer.id)
            ) {
              await pioneer.publishEvent(
                notebookPanel,
                event,
                exporter,
                exporter.activeEvents?.find(
                  o => o.name == CellAddEventProducer.id
                )?.logWholeNotebook
              );
            }
          });
        }
      }
    );
  }
}

export class CellEditEventProducer {
  static id: string = 'CellEditEvent';

  listen(notebookPanel: NotebookPanel, pioneer: IJupyterLabPioneer) {
    const sendDoc = async (_: Notebook, cell: Cell<ICellModel> | null) => {
      await cell?.ready; // wait until cell is ready, to prevent errors when creating new cells
      const editor = cell?.editor as CodeMirrorEditor;

      const event = {
        eventName: CellEditEventProducer.id,
        eventTime: Date.now(),
        eventInfo: {
          index: notebookPanel.content.widgets.findIndex(
            value => value === cell
          ),
          doc: editor?.state?.doc?.toJSON(), // send entire cell content if this is a new cell,
          type: cell?.model.type
        }
      };
      pioneer.exporters.forEach(async exporter => {
        if (
          exporter.activeEvents
            ?.map(o => o.name)
            .includes(CellEditEventProducer.id)
        ) {
          await pioneer.publishEvent(
            notebookPanel,
            event,
            exporter,
            exporter.activeEvents?.find(o => o.name == CellEditEventProducer.id)
              ?.logWholeNotebook
          );
        }
      });
    };

    const addDocChangeListener = async (cell: Cell<ICellModel> | null) => {
      await cell?.ready; // wait until cell is ready, to prevent errors when creating new cells
      const editor = cell?.editor as CodeMirrorEditor;

      editor?.injectExtension(
        EditorView.updateListener.of(async (v: ViewUpdate) => {
          if (v.docChanged) {
            const event = {
              eventName: CellEditEventProducer.id,
              eventTime: Date.now(),
              eventInfo: {
                index: notebookPanel.content.widgets.findIndex(
                  value => value === cell
                ),
                changes: v.changes.toJSON(), // send changes
                type: cell?.model.type
              }
            };
            pioneer.exporters.forEach(async exporter => {
              if (
                exporter.activeEvents
                  ?.map(o => o.name)
                  .includes(CellEditEventProducer.id)
              ) {
                await pioneer.publishEvent(
                  notebookPanel,
                  event,
                  exporter,
                  false // do not log whole notebook for doc changes
                );
              }
            });
          }
        })
      );
    };

    notebookPanel?.content?.widgets.forEach(cell => {
      addDocChangeListener(cell);
    }); // add listener to existing cells
    sendDoc(notebookPanel.content, notebookPanel.content.activeCell); // send initial active cell content

    notebookPanel.content.model?.cells.changed.connect(
      async (_, args: IObservableList.IChangedArgs<ICellModel>) => {
        if (args.type === 'add') {
          addDocChangeListener(notebookPanel?.content?.widgets[args.newIndex]);
        }
      }
    ); // add doc change listener to cells created after initialization
    notebookPanel.content.activeCellChanged.connect(sendDoc); // send active cell content when active cell changes
  }
}

export class CellExecuteEventProducer {
  static id: string = 'CellExecuteEvent';

  listen(notebookPanel: NotebookPanel, pioneer: IJupyterLabPioneer) {
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
        if (notebookPanel.content === args.notebook) {
          const executedCell = {
            id: args.cell.model.id,
            index: args.notebook.widgets.findIndex(value => value == args.cell),
            type: args.cell.model.type
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
          pioneer.exporters.forEach(async exporter => {
            if (
              exporter.activeEvents
                ?.map(o => o.name)
                .includes(CellExecuteEventProducer.id)
            ) {
              await pioneer.publishEvent(
                notebookPanel,
                event,
                exporter,
                exporter.activeEvents?.find(
                  o => o.name == CellExecuteEventProducer.id
                )?.logWholeNotebook
              );
            }
          });
        }
      }
    );
  }
}

export class CellRemoveEventProducer {
  static id: string = 'CellRemoveEvent';

  listen(notebookPanel: NotebookPanel, pioneer: IJupyterLabPioneer) {
    notebookPanel.content.model?.cells.changed.connect(
      async (_, args: IObservableList.IChangedArgs<ICellModel>) => {
        if (args.type === 'remove') {
          const removedCell = {
            index: args.oldIndex,
            type: notebookPanel.content.model?.cells.get(args.oldIndex).type
          };
          const event = {
            eventName: CellRemoveEventProducer.id,
            eventTime: Date.now(),
            eventInfo: {
              cells: [removedCell]
            }
          };
          pioneer.exporters.forEach(async exporter => {
            if (
              exporter.activeEvents
                ?.map(o => o.name)
                .includes(CellRemoveEventProducer.id)
            ) {
              await pioneer.publishEvent(
                notebookPanel,
                event,
                exporter,
                exporter.activeEvents?.find(
                  o => o.name == CellRemoveEventProducer.id
                )?.logWholeNotebook
              );
            }
          });
        }
      }
    );
  }
}

export class ClipboardCopyEventProducer {
  static id: string = 'ClipboardCopyEvent';

  listen(notebookPanel: NotebookPanel, pioneer: IJupyterLabPioneer) {
    notebookPanel.node.addEventListener('copy', async () => {
      const cell = {
        id: notebookPanel.content.activeCell?.model.id,
        index: notebookPanel.content.widgets.findIndex(
          value => value === notebookPanel.content.activeCell
        ),
        type: notebookPanel.content.activeCell?.model.type
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
      pioneer.exporters.forEach(async exporter => {
        if (
          exporter.activeEvents
            ?.map(o => o.name)
            .includes(ClipboardCopyEventProducer.id)
        ) {
          await pioneer.publishEvent(
            notebookPanel,
            event,
            exporter,
            exporter.activeEvents?.find(
              o => o.name == ClipboardCopyEventProducer.id
            )?.logWholeNotebook
          );
        }
      });
    });
  }
}

export class ClipboardCutEventProducer {
  static id: string = 'ClipboardCutEvent';

  listen(notebookPanel: NotebookPanel, pioneer: IJupyterLabPioneer) {
    notebookPanel.node.addEventListener('cut', async () => {
      const cell = {
        id: notebookPanel.content.activeCell?.model.id,
        index: notebookPanel.content.widgets.findIndex(
          value => value === notebookPanel.content.activeCell
        ),
        type: notebookPanel.content.activeCell?.model.type
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
      pioneer.exporters.forEach(async exporter => {
        if (
          exporter.activeEvents
            ?.map(o => o.name)
            .includes(ClipboardCutEventProducer.id)
        ) {
          await pioneer.publishEvent(
            notebookPanel,
            event,
            exporter,
            exporter.activeEvents?.find(
              o => o.name == ClipboardCutEventProducer.id
            )?.logWholeNotebook
          );
        }
      });
    });
  }
}

export class ClipboardPasteEventProducer {
  static id: string = 'ClipboardPasteEvent';

  listen(notebookPanel: NotebookPanel, pioneer: IJupyterLabPioneer) {
    notebookPanel.node.addEventListener('paste', async (e: ClipboardEvent) => {
      const cell = {
        id: notebookPanel.content.activeCell?.model.id,
        index: notebookPanel.content.widgets.findIndex(
          value => value === notebookPanel.content.activeCell
        ),
        type: notebookPanel.content.activeCell?.model.type
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
      pioneer.exporters.forEach(async exporter => {
        if (
          exporter.activeEvents
            ?.map(o => o.name)
            .includes(ClipboardPasteEventProducer.id)
        ) {
          await pioneer.publishEvent(
            notebookPanel,
            event,
            exporter,
            exporter.activeEvents?.find(
              o => o.name == ClipboardPasteEventProducer.id
            )?.logWholeNotebook
          );
        }
      });
    });
  }
}

export class NotebookHiddenEventProducer {
  static id: string = 'NotebookHiddenEvent';

  listen(notebookPanel: NotebookPanel, pioneer: IJupyterLabPioneer) {
    document.addEventListener('visibilitychange', async (e: Event) => {
      if (
        document.visibilityState === 'hidden' &&
        document.contains(notebookPanel.node)
      ) {
        const event = {
          eventName: NotebookHiddenEventProducer.id,
          eventTime: Date.now(),
          eventInfo: null
        };
        pioneer.exporters.forEach(async exporter => {
          if (
            exporter.activeEvents
              ?.map(o => o.name)
              .includes(NotebookHiddenEventProducer.id)
          ) {
            await pioneer.publishEvent(
              notebookPanel,
              event,
              exporter,
              exporter.activeEvents?.find(
                o => o.name == NotebookHiddenEventProducer.id
              )?.logWholeNotebook
            );
          }
        });
      }
    });
  }
}

export class NotebookOpenEventProducer {
  static id: string = 'NotebookOpenEvent';
  private produced: boolean = false;

  async listen(notebookPanel: NotebookPanel, pioneer: IJupyterLabPioneer) {
    if (!this.produced) {
      const event = {
        eventName: NotebookOpenEventProducer.id,
        eventTime: Date.now(),
        eventInfo: {
          environ: await requestAPI<any>('environ')
        }
      };
      pioneer.exporters.forEach(async exporter => {
        if (
          exporter.activeEvents
            ?.map(o => o.name)
            .includes(NotebookOpenEventProducer.id)
        ) {
          await pioneer.publishEvent(
            notebookPanel,
            event,
            exporter,
            exporter.activeEvents?.find(
              o => o.name == NotebookOpenEventProducer.id
            )?.logWholeNotebook
          );
          this.produced = true;
        }
      });
    }
  }
}

export class NotebookSaveEventProducer {
  static id: string = 'NotebookSaveEvent';

  listen(notebookPanel: NotebookPanel, pioneer: IJupyterLabPioneer) {
    notebookPanel.context.saveState.connect(
      async (_, saveState: DocumentRegistry.SaveState) => {
        if (saveState.match('completed')) {
          const event = {
            eventName: NotebookSaveEventProducer.id,
            eventTime: Date.now(),
            eventInfo: null
          };
          pioneer.exporters.forEach(async exporter => {
            if (
              exporter.activeEvents
                ?.map(o => o.name)
                .includes(NotebookSaveEventProducer.id)
            ) {
              await pioneer.publishEvent(
                notebookPanel,
                event,
                exporter,
                exporter.activeEvents?.find(
                  o => o.name == NotebookSaveEventProducer.id
                )?.logWholeNotebook
              );
            }
          });
        }
      }
    );
  }
}

const getVisibleCells = (notebookPanel: NotebookPanel) => {
  const visibleCells: Array<any> = [];

  for (let index = 0; index < notebookPanel.content.widgets.length; index++) {
    const cell = notebookPanel.content.widgets[index];

    const cellTop = cell.node.offsetTop;
    const cellBottom = cell.node.offsetTop + cell.node.offsetHeight;
    const viewTop = notebookPanel.node.getElementsByClassName(
      'jp-WindowedPanel-outer'
    )[0].scrollTop;
    const viewBottom =
      notebookPanel.content.node.getElementsByClassName(
        'jp-WindowedPanel-outer'
      )[0].scrollTop +
      notebookPanel.content.node.getElementsByClassName(
        'jp-WindowedPanel-outer'
      )[0].clientHeight;

    if (cellTop <= viewBottom && cellBottom >= viewTop) {
      visibleCells.push({
        id: cell.model.id,
        index: index,
        type: cell.model.type
      });
    }
  }

  return visibleCells;
};

export class NotebookScrollEventProducer {
  static id: string = 'NotebookScrollEvent';
  private timeout = 0;

  listen(notebookPanel: NotebookPanel, pioneer: IJupyterLabPioneer) {
    notebookPanel.node
      .getElementsByClassName('jp-WindowedPanel-outer')[0]
      .addEventListener('scroll', async (e: Event) => {
        e.stopPropagation();
        clearTimeout(this.timeout);
        await new Promise(
          resolve => (this.timeout = window.setTimeout(resolve, 1500))
        ); // wait 1.5 seconds before preceding
        const event = {
          eventName: NotebookScrollEventProducer.id,
          eventTime: Date.now(),
          eventInfo: {
            cells: getVisibleCells(notebookPanel)
          }
        };
        pioneer.exporters.forEach(async exporter => {
          if (
            exporter.activeEvents
              ?.map(o => o.name)
              .includes(NotebookScrollEventProducer.id)
          ) {
            await pioneer.publishEvent(
              notebookPanel,
              event,
              exporter,
              exporter.activeEvents?.find(
                o => o.name == NotebookScrollEventProducer.id
              )?.logWholeNotebook
            );
          }
        });
      });
  }
}

export class NotebookVisibleEventProducer {
  static id: string = 'NotebookVisibleEvent';

  listen(notebookPanel: NotebookPanel, pioneer: IJupyterLabPioneer) {
    document.addEventListener('visibilitychange', async () => {
      if (
        document.visibilityState === 'visible' &&
        document.contains(notebookPanel.node)
      ) {
        const event = {
          eventName: NotebookVisibleEventProducer.id,
          eventTime: Date.now(),
          eventInfo: {
            cells: getVisibleCells(notebookPanel)
          }
        };
        pioneer.exporters.forEach(async exporter => {
          if (
            exporter.activeEvents
              ?.map(o => o.name)
              .includes(NotebookVisibleEventProducer.id)
          ) {
            await pioneer.publishEvent(
              notebookPanel,
              event,
              exporter,
              exporter.activeEvents?.find(
                o => o.name == NotebookVisibleEventProducer.id
              )?.logWholeNotebook
            );
          }
        });
      }
    });
  }
}

export const producerCollection = [
  ActiveCellChangeEventProducer,
  CellAddEventProducer,
  CellExecuteEventProducer,
  CellRemoveEventProducer,
  CellEditEventProducer,
  ClipboardCopyEventProducer,
  ClipboardCutEventProducer,
  ClipboardPasteEventProducer,
  NotebookHiddenEventProducer,
  NotebookOpenEventProducer,
  NotebookSaveEventProducer,
  NotebookScrollEventProducer,
  NotebookVisibleEventProducer
];
