import "./assets/css/pico.css";
import "./assets/css/main.css";
import {
  DeleteNote,
  ReadNote,
  RenameNote,
  ReadNotesDir,
  WriteNote,
} from "../wailsjs/go/main/App";

function resize(textarea) {
  let row_limit = 15;
  textarea.setAttribute("rows", "1");

  const cs = getComputedStyle(textarea);

  // Force content-box for size accurate line-height calculation
  // Remove scrollbars, lock width (subtract inline padding and inline border widths)
  // and remove inline padding and borders to keep width consistent (for text wrapping accuracy)
  const inline_padding =
    parseFloat(cs["padding-left"]) + parseFloat(cs["padding-right"]);
  const inline_border_width =
    parseFloat(cs["border-left-width"]) + parseFloat(cs["border-right-width"]);
  textarea.style.setProperty("overflow", "hidden", "important");
  textarea.style.setProperty(
    "width",
    parseFloat(cs["width"]) - inline_padding - inline_border_width + "px"
  );
  textarea.style.setProperty("box-sizing", "content-box");
  textarea.style.setProperty("padding-inline", "0");
  textarea.style.setProperty("border-width", "0");

  // Get the base line height, and top / bottom padding.
  const block_padding =
    parseFloat(cs["padding-top"]) + parseFloat(cs["padding-bottom"]);
  const line_height =
    // If line-height is not explicitly set, use the computed height value (ignore padding due to content-box)
    cs["line-height"] === "normal"
      ? parseFloat(cs["height"])
      : // Otherwise (line-height is explicitly set), use the computed line-height value.
        parseFloat(cs["line-height"]);

  // Get the scroll height (rounding to be safe to ensure cross browser consistency)
  const scroll_height = Math.round(textarea.scrollHeight);

  // Undo overflow, width, border-width, box-sizing & inline padding overrides
  textarea.style.removeProperty("width");
  textarea.style.removeProperty("box-sizing");
  textarea.style.removeProperty("padding-inline");
  textarea.style.removeProperty("border-width");
  textarea.style.removeProperty("overflow");

  // Subtract block_padding from scroll_height and divide that by our line_height to get the row count.
  // Round to nearest integer as it will always be within ~.1 of the correct whole number.
  const rows = Math.round((scroll_height - block_padding) / line_height);

  // Set the calculated rows attribute (limited by row_limit)
  textarea.setAttribute("rows", "" + Math.min(rows, row_limit));
}

function autosize(textarea) {
  textarea.style.setProperty("resize", "none");
  textarea.style.setProperty("min-height", "0");
  textarea.style.setProperty("max-height", "none");
  textarea.style.setProperty("height", "auto");

  textarea.addEventListener("input", (e) => resize(e.target));

  // Trigger the event to set the initial rows value
  textarea.dispatchEvent(
    new Event("input", {
      bubbles: true,
    })
  );
}

async function populateNoteList(noteTitle, noteBody, noteList) {
  noteList.innerHTML = "";

  let notes = await ReadNotesDir();
  notes.forEach((note) => {
    let $note = document.createElement("li");
    $note.innerText = note;
    $note.addEventListener("click", async (e) => {
      let title = e.target.innerText;

      let note = await ReadNote(title);
      noteTitle.value = note.Title;
      noteBody.value = note.Body;
      resize(noteBody);
    });

    noteList.append($note);
  });
}

window.addEventListener("load", async () => {
  let $saveButton = document.querySelector("#saveButton");
  let $noteTitle = document.querySelector("#noteTitle");
  let $noteBody = document.querySelector("#noteBody");
  let $noteList = document.querySelector("#noteList");
  let $rtlButton = document.querySelector("#rtlButton");
  let $newNoteButton = document.querySelector("#newNoteButton");
  let $deleteNoteButton = document.querySelector("#deleteNoteButton");

  $newNoteButton.addEventListener("click", () => {
    $noteTitle.value = "";
    $noteBody.value = "";
    resize($noteBody);
  });

  let $state = {
    keystrokeCount: 0,
    oldNoteName: "",
    newNoteName: "",
  };

  populateNoteList($noteTitle, $noteBody, $noteList);

  $deleteNoteButton.addEventListener("click", () => {
    DeleteNote($noteTitle.value)
      .then(() => {
        console.log("successfully deleted note");
      })
      .catch((e) => console.error(e));

    $noteTitle.value = "";
    $noteBody.value = "";
    populateNoteList($noteTitle, $noteBody, $noteList);
  });

  $rtlButton.addEventListener("click", () => {
    if ($noteBody.dir == "ltr") {
      $noteBody.dir = "rtl";
    } else {
      $noteBody.dir = "ltr";
    }
  });

  $saveButton.addEventListener("click", () => {
    WriteNote($noteTitle.value, $noteBody.value)
      .then(() => {
        console.log("successfully saved note!");
      })
      .catch((e) => {
        console.log("failed to save note");
        console.log(e);
      });

    populateNoteList($noteTitle, noteBody, noteList);
  });

  autosize($noteBody);

  $noteBody.addEventListener("input", (e) => {
    $state.keystrokeCount += 1;
    if ($state.keystrokeCount < 5) {
      return;
    }

    WriteNote($noteTitle.value, $noteBody.value)
      .then(() => console.log("successfully stored note after 5 keystrokes"))
      .catch((e) => {
        console.error("failed to save note after 5 keystrokes" + e);
      });
    populateNoteList($noteTitle, $noteBody, $noteList);

    $state.keystrokeCount = 0;
  });

  $noteBody.addEventListener("change", () => {
    WriteNote($noteTitle.value, $noteBody.value)
      .then(() => console.log("successfully stored note after 5 keystrokes"))
      .catch((e) => {
        console.error("failed to save note after 5 keystrokes" + e);
      });
    populateNoteList($noteTitle, $noteBody, $noteList);
  });

  $noteTitle.addEventListener("focus", () => {
    $state.oldNoteName = $noteTitle.value;
  });

  $noteTitle.addEventListener("blur", () => {
    $state.newNoteName = $noteTitle.value;

    if ($state.newNoteName.trim() == "" || $noteBody.value.trim() == "") {
      return;
    }

    if ($state.oldNoteName.trim() == "") {
      populateNoteList($noteTitle, $noteBody, $noteList);
      return WriteNote($state.newNoteName, $noteBody.value);
    }

    RenameNote($state.oldNoteName, $state.newNoteName)
      .then(() => console.log("renamed note successfully"))
      .catch((e) => console.error("failed to rename note" + e));
    populateNoteList($noteTitle, $noteBody, $noteList);
  });
});
