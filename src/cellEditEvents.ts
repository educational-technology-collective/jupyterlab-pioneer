import {
  NotebookPanel,
} from '@jupyterlab/notebook';
import { IJupyterLabPioneer } from './index';
import {
    CodeMirrorEditor,
} from '@jupyterlab/codemirror';

// import { StateField } from '@codemirror/state';

export class CellEditEventProducer {
    static id: string = 'CellEditEvent'
    listen(
        notebookPanel: NotebookPanel,
        pioneer: IJupyterLabPioneer,
        logNotebookContentEvent: boolean
    ) {
        // to be moved to `utils.ts`
        type ThrottledFunction<T extends (...args: any) => any> = (...args: Parameters<T>) => ReturnType<T>;
        function throttle<T extends (...args: any) => any>(func: T, limit: number): ThrottledFunction<T> {
            let inThrottle: boolean;
            let lastResult: ReturnType<T>;

            return function(this: any): ReturnType<T> {
                const args = arguments;
                const context = this;

                if (!inThrottle) {
                    inThrottle = true;
                    setTimeout(() => (inThrottle = false), limit);
                    lastResult = func.apply(context, args);
                }

                return lastResult;
            };
        }

        const cellEditEventHelper = async () => {
            const editor = notebookPanel.content.activeCell?.editor as CodeMirrorEditor;
            if (editor.hasFocus()) {
                const cursorPosition = editor.getCursorPosition()
                const event = {
                    eventName: CellEditEventProducer.id,
                    eventTime: Date.now(),
                    eventInfo: {
                        index: notebookPanel.content.activeCellIndex,
                        cursorPosition: cursorPosition,
                        doc: editor.state.doc
                    }
                };
            await pioneer.publishEvent(notebookPanel, event, logNotebookContentEvent);
            };
        }
        
        notebookPanel.node.addEventListener('keydown', throttle(cellEditEventHelper, 50));
        notebookPanel.node.addEventListener('mousedown', throttle(cellEditEventHelper, 50));
        notebookPanel.node.addEventListener('paste', throttle(cellEditEventHelper, 50));
        notebookPanel.node.addEventListener('cut', throttle(cellEditEventHelper, 50));
    }
}