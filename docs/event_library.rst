Event Library
=============

.. list-table::
   :widths: 25 25 50
   :header-rows: 1

   * - Event Name
     - Event is triggered when
     - Event Data (except for event name and time)
   * - ActiveCellChangeEvent
     - user moves focus to a different cell
     - activated cell id and index
   * - CellAddEvent
     - a new cell is added
     - added cell id and index
   * - CellEditEvent
     - user moves focus to a different cell
     - cell index, the codemirror editor content of the cell
   * - CellEditEvent
     - user edits a cell
     - cell index, the codemirror editor changeset of the cell
   * - CellExecuteEvent
     - a cell is executed
     - executed cell id and index, a boolean indicates success or failure, kernel error detail if execution failed
   * - CellRemoveEvent
     - a cell is removed
     - removed cell id and index
   * - ClipboardCopyEvent
     - user copies from a notebook cell
     - id and index of the cell the user copies from, text copied
   * - ClipboardCutEvent
     - user cuts from a notebook cell
     - id and index of the cell the user cuts from, text cut
   * - ClipboardPasteEvent
     - user pastes to a notebook cell
     - id and index of the cell the user pastes to, text copied
   * - NotebookHiddenEvent
     - user leaves the Jupyter Lab tab
     - 
   * - NotebookOpenEvent
     - a notebook is opened
     - environment variables
   * - NotebookSaveEvent
     - a notebook is saved
     - 
   * - NotebookScrollEvent
     - user scrolls on the notebook
     - visible cells after scrolling
   * - NotebookVisibleEvent
     - user navigates back to Jupyter Lab
     - visible cells when user navigates back