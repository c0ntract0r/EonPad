import React from 'react';
import { useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import { moveItemAsync } from '../features/notes/noteSlice'

const ItemTypes = {
  NOTE: 'note',
  FOLDER: 'folder'
};

const DroppableFolder = ({ folder, folderId, children }) => {
  const dispatch = useDispatch();

  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.NOTE, ItemTypes.FOLDER],
    drop: (item) => {
      if (item.id !== folderId && item.type !== 'folder') {
        dispatch(moveItemAsync({
          sourceId: item.id,
          targetId: folderId,
          itemType: item.type,
          sourceFolderId: item.folderId,
          sourceSubfolderId: item.subfolderId
        }));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  return (
    <div ref={drop} className={`${isOver ? 'bg-primary/10 border-primary border-2 border-dashed' : ''} rounded`}>
      {children}
    </div>
  );
};

export default DroppableFolder;