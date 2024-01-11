import React, { useState, useRef, useEffect } from "react";
import "./bulletinBoard.css";

const BulletinBoard = () => {
  if(localStorage.getItem("notes") === null) {
    localStorage.setItem("notes", JSON.stringify([]));
  }
  const initialNotes = localStorage.getItem("notes"); 
  const [notes, setNotes] = useState([...JSON.parse(initialNotes)]);
  const [showInputPopup, setShowInputPopup] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");

  const [start, setStart] = useState({ x: 0, y: 0 });
  const handleMouseMoveRef = useRef(null);
  const handleMouseUpRef = useRef(null);
  const addNote = () => {
    setShowInputPopup(true);
  };

  const saveNote = () => {
    if (newNoteContent.trim() !== "") {
      const newNote = {
        id: Date.now(),
        content: newNoteContent,
        x: Math.floor(Math.random() * 200),
        y: Math.floor(Math.random() * 200),
        isDraggable: true,
        isEditing: false,
      };

      setNotes([...notes, newNote]);
      setNewNoteContent("");
      setShowInputPopup(false);

      // Save notes to local storage
      const updatedNotes = [...notes, newNote];
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    localStorage.setItem(
      "notes",
      JSON.stringify(notes.filter((note) => note.id !== id))
    );
  };
  const handleEdit = (id) => {
    if (!notes.find((note) => note.id === id).isDraggable) {
      return;
    }
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, isEditing: true } : note
      )
    );
  };
  const handleMouseDown = (e, id) => {
    if (!notes.find((note) => note.id === id).isDraggable) {
      return;
    }
    const startX = e.clientX;
    const startY = e.clientY;
    console.log(startX, startY);
    setStart({ x: startX, y: startY });
    handleMouseMoveRef.current = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const updatedX = start.x + deltaX;
      const updatedY = start.y + deltaY;

      // Ensure the note stays within the screen boundaries
      const maxX = window.innerWidth;
      const maxY = window.innerHeight; // Adjust the value based on your preference

      const boundedX = Math.max(0, Math.min(updatedX, maxX + 20));
      const boundedY = Math.max(0, Math.min(updatedY, maxY + 20));

      setNotes(
        notes.map((note) =>
          note.id === id ? { ...note, x: boundedX, y: boundedY } : note
        )
      );
    };

    handleMouseUpRef.current = () => {
      document.removeEventListener("mousemove", handleMouseMoveRef.current);
      document.removeEventListener("mouseup", handleMouseUpRef.current);
    };

    document.addEventListener("mousemove", handleMouseMoveRef.current);
    document.addEventListener("mouseup", handleMouseUpRef.current);
    localStorage.setItem("notes", JSON.stringify(notes));
  };

  const handlePin = (e, id) => {
    const pinnedNote = notes.find((note) => note.id === id);
    pinnedNote.isDraggable = !pinnedNote.isDraggable;
    if (pinnedNote) {
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes([pinnedNote, ...updatedNotes]);
    }
    localStorage.setItem("notes", JSON.stringify(notes));
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      saveNote();
    }
  };
  useEffect(() => {}, [notes]);
  return (
    <div className="bulletin-board">
      <button onClick={addNote} className="add-note-button">
        +{" "}
      </button>

      {showInputPopup && (
        <div className="input-popup">
          <textarea
            type="textarea"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Enter note content"
            onKeyDown={handleKeyPress}
          />
          <button onClick={saveNote}>✔️</button>
        </div>
      )}
      <div className="parent">
        {notes.map((note) =>
          !note.isEditing ? (
            <div
              key={note.id}
              className={`sticky-note ${note.isDraggable ? "" : "pinned"}`}
              style={{ transform: `translate(${note.x}px, ${note.y}px)` }}
            >
              <div className="buttons">
                <button
                  className="delete-icon"
                  onClick={() => deleteNote(note.id)}
                >
                  &#x2716;
                </button>
                <button
                  className="pin-notes"
                  onClick={(e) => handlePin(e, note.id)}
                >
                  📌
                </button>

                <button
                  className={`drag-icon${note.isDraggable ? "" : "-disabled"}`}
                  onMouseDown={(e) => handleMouseDown(e, note.id)}
                >
                  &#x2630;
                </button>
              </div>
              <div className="content" onClick={() => handleEdit(note.id)}>
                {note.content}
              </div>
            </div>
          ) : (
            <textarea
              className="sticky-note"
              style={{ transform: `translate(${note.x}px, ${note.y}px)` }}
              value={note.content}
              onChange={(e) => {
                setNotes(
                  notes.map((n) =>
                    n.id === note.id ? { ...n, content: e.target.value } : n
                  )
                );
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  setNotes(
                    notes.map((n) =>
                      n.id === note.id
                        ? { ...n, isEditing: false, content: e.target.value }
                        : n
                    )
                  );
                  localStorage.setItem("notes", JSON.stringify(notes.map(n => ({...n, isEditing: false}))));
                }
              }}
            />
          )
        )}
      </div>
    </div>
  );
};

export default BulletinBoard;
