import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsFileText } from "react-icons/bs";
import { IoMdSave } from "react-icons/io";
import { updateNoteContent, updateNoteAsync } from '../features/notes/noteSlice';

const NoteEditor = () => {
  const dispatch = useDispatch();
  const selectedNote = useSelector(state => state.notes?.selectedNote || null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || '');
      setBody(selectedNote.body || '');
      setHasUnsavedChanges(false);
    } else {
      setTitle('');
      setBody('');
      setHasUnsavedChanges(false);
    }
  }, [selectedNote]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
    if (selectedNote) {
      dispatch(updateNoteContent({
        noteId: selectedNote.id,
        title: e.target.value,
        body
      }));
    }
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
    setHasUnsavedChanges(true);
    if (selectedNote) {
      dispatch(updateNoteContent({
        noteId: selectedNote.id,
        title,
        body: e.target.value
      }));
    }
  };

  const handleManualSave = () => {
    if (selectedNote && (hasUnsavedChanges || selectedNote.isDirty)) {
      dispatch(updateNoteAsync({
        noteId: selectedNote.id,
        data: { title, body }
      }));
      setHasUnsavedChanges(false);
    }
  };

  if (!selectedNote) {
    return (
      <div className="flex items-center justify-center h-full bg-base-100">
        <div className="text-center">
          <BsFileText size={64} className="mx-auto text-base-300 mb-4" />
          <h2 className="text-2xl font-semibold text-base-content mb-2">
            Select a note to get started
          </h2>
          <p className="text-base-content/70">
            Choose a note from the sidebar to view and edit its content
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-base-100">
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="input input-ghost text-2xl font-bold"
            placeholder="Note title..."
          />
          {(selectedNote.isDirty || hasUnsavedChanges) && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-sm text-base-content/70">Unsaved</span>
            </div>
          )}
        </div>
        <button
          onClick={handleManualSave}
          disabled={!hasUnsavedChanges && !selectedNote.isDirty}
          className="btn btn-primary"
        >
          <IoMdSave size={16} />
          Save
        </button>
      </div>
      <textarea
        value={body}
        onChange={handleBodyChange}
        className="flex-1 p-4 border-none outline-none resize-none text-lg leading-relaxed bg-base-100"
        placeholder="Start writing your note here..."
      />
    </div>
  );
};

export default NoteEditor;