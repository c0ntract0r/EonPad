import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateNoteAsync } from '../features/notes/noteSlice';

const useAutoSave = () => {
  const dispatch = useDispatch();
  const notesState = useSelector(state => state.notes || {});
  const { folders = {} } = notesState;

  useEffect(() => {
    const interval = setInterval(() => {
      const findDirtyNotes = (folders) => {
        const dirtyNotes = [];
        Object.values(folders).forEach(folder => {
          folder.notes.forEach(note => {
            if (note.isDirty) {
              dirtyNotes.push(note);
            }
          });
          Object.values(folder.subfolders || {}).forEach(subfolder => {
            subfolder.notes.forEach(note => {
              if (note.isDirty) {
                dirtyNotes.push(note);
              }
            });
          });
        });
        return dirtyNotes;
      };

      const dirtyNotes = findDirtyNotes(folders);
      dirtyNotes.forEach(note => {
        if (Date.now() - note.lastModified >= 3000) {
          dispatch(updateNoteAsync({
            noteId: note.id,
            data: { title: note.title, body: note.body }
          }));
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [dispatch, folders]);
};

export default useAutoSave;