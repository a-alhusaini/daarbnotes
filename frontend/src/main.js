import "./assets/css/pico.css";
import "./assets/css/main.css";
import {
  DeleteNote,
  ReadNote,
  RenameNote,
  ReadNotesDir,
  WriteNote,
} from "../wailsjs/go/main/App";

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
