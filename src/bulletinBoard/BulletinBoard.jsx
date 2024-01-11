import React, { useState, useRef, useEffect } from "react";
import "./bulletinBoard.css";

const BulletinBoard = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      isDraggable: true,
      content:
        "lorem ipsum dolor sit amet it necter heck ameshe Hottest Trend in Learning! Introducing our Brand New Course,Understanding PsychologyExplore humanbehavior biologyand cognition. Get foundational insights for real-world applications!Topics to be Covered:🪄🖊 What is Mental health🖊 Scopes and Arena under Psycholog🖊 Laws and Regulations Acts in Mental Health Field🖊 How to start a venture and Practice🖊 Counsellor skills🖊 Ethics & Guidelines in Counselling🖊 Brain, Neurons and Neurotransmitters to Behaviors",
      x: 100,
      y: 100,
      isEditing: false,
    },
  ]);
  const [showInputPopup, setShowInputPopup] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");

  const [start, setStart] = useState({ x: 0, y: 0 });
  const handleMouseMoveRef = useRef(null);
  const handleMouseUpRef = useRef(null);
  const addNote = () => {
    setShowInputPopup(true);
  };

  // const editNote = (e,id) => {
  //   const note = notes.find((note) => note.id === id);
  //   if(!note.isDraggable){
  //     return;
  //   }
  //   note.isEditing = true;
  //   const updatedNotes = notes.filter((note) => note.id !== id);
  //   setNotes(updatedNotes);
  //   setShowInputPopup(true);
  //   setNewNoteContent(note.content);
  // }
  const saveNote = () => {
    if (newNoteContent.trim() !== "") {
      setNotes([
        ...notes,
        {
          id: Date.now(),
          content: newNoteContent,
          x: Math.floor(Math.random() * 200),
          y: Math.floor(Math.random() * 200),
          isDraggable: true,
        },
      ]);
      setNewNoteContent("");
      setShowInputPopup(false);
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleMouseDown = (e, id) => {
    if(!notes.find((note) => note.id === id).isDraggable){
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
      const maxY = window.innerHeight ; // Adjust the value based on your preference

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
  };
  const handlePin = (e, id) => {
    const pinnedNote = notes.find((note) => note.id === id);
    pinnedNote.isDraggable = !pinnedNote.isDraggable;
    if (pinnedNote) {
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes([pinnedNote, ...updatedNotes]);
    }
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
        {notes.map((note) => (
         
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
              <button className="pin-notes" onClick={(e)=>handlePin(e,note.id)}>📌</button>

              <button
                className={`drag-icon${note.isDraggable ? "" : "-disabled"}`}
                onMouseDown={(e) => handleMouseDown(e, note.id)}
              >
                &#x2630;
              </button>
            </div>
            <div className="content">{note.content}</div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default BulletinBoard;
