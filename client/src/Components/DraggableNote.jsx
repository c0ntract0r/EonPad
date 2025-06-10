import React from 'react';
import { useDrag } from 'react-dnd';
import { BsFileText } from "react-icons/bs";
import { FiMoreHorizontal } from "react-icons/fi";


const ItemTypes = {
  NOTE: 'note',
  FOLDER: 'folder'
};

const DraggableNote = ({ note, folderId, subfolderId, onNoteClick, onMenuClick, activeMenu, onDeleteNote }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.NOTE,
    item: { id: note.id, type: 'note', folderId, subfolderId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      className={`flex items-center justify-between p-2 hover:bg-base-200 rounded cursor-pointer mb-1 group ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center flex-1" onClick={() => onNoteClick(note)}>
        <BsFileText size={14} className="mr-2 text-base-content/70" />
        <span className="text-sm text-base-content truncate">{note.title}</span>
        {note.isDirty && <div className="w-2 h-2 bg-warning rounded-full ml-2"></div>}
      </div>
      <div className="relative">
        <button
          onClick={(e) => onMenuClick(e, note.id, 'note')}
          className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100"
        >
          <FiMoreHorizontal size={12} />
        </button>
        {activeMenu === note.id && (
          <div className="dropdown dropdown-end">
            <ul className="menu dropdown-content bg-base-100 rounded-box shadow-lg p-1 min-w-20">
              <li>
                <button className="text-error" onClick={() => onDeleteNote(note.id, folderId, subfolderId)}>
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggableNote;