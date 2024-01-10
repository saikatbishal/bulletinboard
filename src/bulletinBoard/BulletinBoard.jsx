import React, { useState, useRef } from 'react';
import './bulletinBoard.css'; // You can add some styles in a separate CSS file

const BulletinBoard = () => {
  const [notes, setNotes] = useState([]);
  const [showInputPopup, setShowInputPopup] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const handleMouseMoveRef = useRef(null);
  const handleMouseUpRef = useRef(null);
  const addNote = () => {
    setShowInputPopup(true);
  };

  const saveNote = () => {
    if(newNoteContent.trim()!==''){
         setNotes([...notes, { id: Date.now(), content: newNoteContent, x: Math.floor(Math.random() * 400), 
    y: Math.floor(Math.random() * 400),  }]);
    setNewNoteContent('');
    setShowInputPopup(false);
    }
   
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };
  const handleMouseDown = (e, id) => {
    let startX = e.clientX;
    let startY = e.clientY;
  
    handleMouseMoveRef.current = (e) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
  
        setNotes(
          notes.map((note) =>
            note.id === id ? { ...note, x: note.x + deltaX, y: note.y + deltaY } : note
          )
        );
  
        startX = e.clientX;
        startY = e.clientY;
      };
    handleMouseUpRef.current = () => {
        document.removeEventListener('mousemove', handleMouseMoveRef.current);
        document.removeEventListener('mouseup', handleMouseUpRef.current);
      };
  
      document.addEventListener('mousemove', handleMouseMoveRef.current);
      document.addEventListener('mouseup', handleMouseUpRef.current);
  
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter'&& !e.shiftKey) {
        saveNote();
    }
};

  

  return (
    <div className="bulletin-board">
      <button onClick={addNote} className="add-note-button">
        Add Note
      </button>

      {showInputPopup && (
        <div className="input-popup">
          <textarea
            type="textarea"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)
            }
            placeholder="Enter note content"
            onKeyDown={handleKeyPress}
            
          />
          <button onClick={saveNote}>Save</button>
        </div>
      )}
      {notes.map((note) => (
        <div
          key={note.id}
          className="sticky-note"
          style={{ transform: `translate(${note.x}px, ${note.y}px)`, height:'max-content', padding:'20px', display:"grid", justifyContent:'space-between', gridGap:'10px' }}
        >
          <div>{note.content}</div>
          <div className='buttons'>
<button className="delete-icon" onClick={() => deleteNote(note.id)}>
            &#x2716;
          </button>
          <button
            className="drag-handle"
            onMouseDown={(e) => handleMouseDown(e, note.id)}
          >
            &#x2630;
          </button>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default BulletinBoard;
