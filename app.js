addEventListener("DOMContentLoaded", () => {
  const AddBtn_display = document.getElementById("addBtn");
  const ThemeBtn = document.getElementById("themeBtn");
  let Titleinput = document.getElementById("Titleinput");
  let NoteContent = document.getElementById("NoteContent");
  const addNotebtn = document.getElementById("addnoteBtn");
  const closeBtn = document.getElementById("closeBtn");
  const pretext = document.getElementById("pretext");

  const grid = document.querySelector(".grid-container");
  let NoteIdEdit = null; //store the id of the note
  let NoteIdDel = null; //store the id of the note

  let NotesArray = JSON.parse(localStorage.getItem("notes")) || [];

  let SavedTheme = localStorage.getItem("themeindex");

  let currThemeIndex = SavedTheme !== null ? parseInt(SavedTheme) : 0;

  let ThemeArray = [
    { id: 0, theme: "default" },
    { id: 1, theme: "darkmode" },
    { id: 2, theme: "forest" },
    { id: 3, theme: "coffee" },
    { id: 3, theme: "The new cycle" },
  ];

  const root = document.documentElement;
  root.classList.add(ThemeArray[currThemeIndex].theme);
  if (NotesArray.length != 0) {
    pretext.style.display = "none";
  }

  //show the input window
  AddBtn_display.addEventListener("click", () => {
    NoteIdEdit = null;
    pretext.style.display = "none";

    showInputCont("add new ", "+ Add");
  });
  closeBtn.addEventListener("click", closeWindow);
  addNotebtn.addEventListener("click", addNotetoarr);

  function showInputCont(titleText, Btntext) {
    Titleinput.value = "";
    NoteContent.value = "";
    const Container = document.getElementById("input-container");
    const headingText = document.getElementById("input-container-heading");
    Container.classList.add("show");
    headingText.textContent = titleText;
    addNotebtn.textContent = Btntext;
    Titleinput.focus();
  }

  //adding to the notesarray
  function addNotetoarr() {
    let noteTitle = Titleinput.value.trim();
    let noteContent = NoteContent.value
      .trim()
      .split(">")
      .filter((word) => word.trim() !== "")
      .map((word) => `👉${word}`)
      .join(`<br>`);

    console.log(noteTitle);
    console.log(noteContent);

    if (!noteTitle) {
      noteTitle = "No title";
    }

    if (NoteIdEdit !== null) {
      console.log("Editing now");
      const NotetoEdit = NotesArray.find((n) => n.id === NoteIdEdit);
      if (NotetoEdit) {
        NotetoEdit.title = noteTitle;
        NotetoEdit.Notes = noteContent;
        localStorage.setItem("notes", JSON.stringify(NotesArray));
        renderAllNotes();
        closeWindow();
      }
    }
    //add new note if Noteid = null
    else if (NoteIdEdit === null) {
      let NoteID = Date.now();
      NotesArray.push({
        id: NoteID,
        title: noteTitle,
        Notes: noteContent,
      });
      console.log("note saved");
      localStorage.setItem("notes", JSON.stringify(NotesArray));
      renderAllNotes();
      closeWindow();
    }
  }

  //to render all notes
  function renderAllNotes() {
    if (NotesArray.length != 0) {
      pretext.style.display = "none";
    } else {
      pretext.style.display = "block";
    }
    grid.innerHTML = "";
    NotesArray.forEach((note) => {
      const box = document.createElement("div");
      box.classList.add("box");
      box.innerHTML = `
      <button data-id="${note.id}" class ="editBtn">🖋️</button>
      <br> 
      <h2>${note.title}</h2> 
      <br>
      <div class="noteContent">
        <p>${note.Notes}</p> 
      </div>
      
      <br>
      <button class="delBtn">❌</button>
      `;

      grid.appendChild(box);

      const editBnt = box.querySelector(".editBtn");
      editBnt.addEventListener("click", () => {
        NoteIdEdit = note.id;
        showInputCont("Edit", "save");
        Titleinput.value = note.title;

        NoteContent.value = note.Notes.replace(/<br>/g, " ")
          .split("👉")
          .filter((word) => word.trim() !== "")
          .map((word) => `>${word.trim()}`)
          .join("\n");
      });

      const delBtn = box.querySelector(".delBtn");
      delBtn.addEventListener("click", () => {
        NoteIdDel = note.id;

        NotesArray = NotesArray.filter((note) => note.id !== NoteIdDel);
        localStorage.setItem("notes", JSON.stringify(NotesArray));
        renderAllNotes();
      });
    });
  }

  function closeWindow() {
    const Container = document.getElementById("input-container");
    Container.classList.remove("show");
    Titleinput.focus();
  }
  renderAllNotes();

  ThemeBtn.addEventListener("click", () => {
    const root = document.documentElement; //to get the root pseudoclass

    root.classList.remove(ThemeArray[currThemeIndex].theme);

    currThemeIndex = (currThemeIndex + 1) % ThemeArray.length;

    const new_theme = ThemeArray[currThemeIndex].theme;
    localStorage.setItem("themeindex", currThemeIndex);

    root.classList.add(new_theme);
    alert("Theme changed to: " + new_theme);
  });
});
