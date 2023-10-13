import { Notebook, NotebookPanel } from '@jupyterlab/notebook';
import { Cell, ICellModel } from '@jupyterlab/cells';
import { IObservableList } from '@jupyterlab/observables';
import { CodeMirrorEditor } from '@jupyterlab/codemirror';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { IJupyterLabPioneer } from './index';

export class CellEditEventProducer {
  static id: string = 'CellEditEvent';

  listen(
    notebookPanel: NotebookPanel,
    pioneer: IJupyterLabPioneer,
    logNotebookContentEvent: boolean
  ) {
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
          doc: editor?.state?.doc?.toJSON() // send entire cell content if this is a new cell
        }
      };
      await pioneer.publishEvent(notebookPanel, event, logNotebookContentEvent);
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
                changes: v.changes.toJSON() // send changes
              }
            };
            await pioneer.publishEvent(
              notebookPanel,
              event,
              logNotebookContentEvent
            );
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

// type ThrottledFunction<T extends (...args: any) => any> = (...args: Parameters<T>) => ReturnType<T>;
// function throttle<T extends (...args: any) => any>(func: T, limit: number): ThrottledFunction<T> {
//     let inThrottle: boolean;
//     let lastResult: ReturnType<T>;

//     return function(this: any): ReturnType<T> {
//         const args = arguments;
//         const context = this;

//         if (!inThrottle) {
//             inThrottle = true;
//             setTimeout(() => (inThrottle = false), limit);
//             lastResult = func.apply(context, args);
//         }

//         return lastResult;
//     };
// }
