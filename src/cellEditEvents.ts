import {
    Notebook,
  NotebookPanel,
} from '@jupyterlab/notebook';
import { Cell, ICellModel } from '@jupyterlab/cells';
import { IJupyterLabPioneer } from './index';
import {
    CodeMirrorEditor,
} from '@jupyterlab/codemirror';
import {
  EditorView,
  ViewUpdate
} from "@codemirror/view";
export class CellEditEventProducer {
    static id: string = 'CellEditEvent'

    listen(
        notebookPanel: NotebookPanel,
        pioneer: IJupyterLabPioneer,
        logNotebookContentEvent: boolean
    ) {
        const cellEditEventHandler = 
            async (_: Notebook, cell: Cell<ICellModel> | null) => {
                const editor = cell?.editor as CodeMirrorEditor

                const event = {
                    eventName: CellEditEventProducer.id,
                    eventTime: Date.now(),
                    eventInfo: {
                        index: notebookPanel.content.widgets.findIndex(
                            value => value === cell
                        ),
                        doc: editor.state?.doc?.toJSON(),
                    }
                }; 
                await pioneer.publishEvent(notebookPanel, event, logNotebookContentEvent);

                editor.injectExtension(EditorView.updateListener.of(
                    async (v: ViewUpdate) => {
                        if (v.docChanged) {
                            const event = {
                                eventName: CellEditEventProducer.id,
                                eventTime: Date.now(),
                                eventInfo: {
                                    index: notebookPanel.content.widgets.findIndex(
                                        value => value === cell
                                    ),
                                    // doc: v.state.doc.toJSON(),
                                    changes: v.changes.toJSON()
                                }
                            };
                            await pioneer.publishEvent(notebookPanel, event, logNotebookContentEvent);
                        }
                    })
                )
            }

        cellEditEventHandler(notebookPanel?.content, notebookPanel?.content?.widgets[0]) // initialize first cell

        notebookPanel.content.activeCellChanged.connect(cellEditEventHandler);
    }
}

        // // to be moved to `utils.ts`
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

        // const cellEditEventHelper = async () => {
        //     // if (editor.hasFocus()) {
        //     //     const cursorPosition = editor.getCursorPosition()
        //     //     const event = {
        //     //         eventName: CellEditEventProducer.id,
        //     //         eventTime: Date.now(),
        //     //         eventInfo: {
        //     //             index: notebookPanel.content.activeCellIndex,
        //     //             cursorPosition: cursorPosition,
        //     //             doc: editor.state.doc
        //     //         }
        //     //     };
        //     // await pioneer.publishEvent(notebookPanel, event, logNotebookContentEvent);
        //     // };
        // }
        // notebookPanel.node.addEventListener('keydown', cellEditEventHelper);
        // // notebookPanel.node.addEventListener('mousedown', throttle(cellEditEventHelper, 50));
        // // notebookPanel.node.addEventListener('paste', throttle(cellEditEventHelper, 50));
        // // notebookPanel.node.addEventListener('cut', throttle(cellEditEventHelper, 50));