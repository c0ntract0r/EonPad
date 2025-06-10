import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllNotes, createNote, updateNote, deleteNote, deleteFolder, renameFolder, moveNote, moveFolder, createFolder } from '../../utils/api';

// Async thunks
export const fetchNotesAsync = createAsyncThunk(
  'notes/fetchNotes',
  async () => {
    const response = await getAllNotes();
    return response.data;
  }
);

export const updateNoteAsync = createAsyncThunk(
  'notes/updateNote',
  async ({ noteId, data }) => {
    const response = await updateNote({ ...data, noteId });
    return { noteId, data: response.data };
  }
);

export const deleteNoteAsync = createAsyncThunk(
  'notes/deleteNote',
  async ({ noteId, folderId, subfolderId }) => {
    await deleteNote({ noteId });
    return { noteId, folderId, subfolderId };
  }
);

export const deleteFolderAsync = createAsyncThunk(
  'notes/deleteFolder',
  async ({ folderId, deleteContents }) => {
    await deleteFolder({ folderId, deleteContents });
    return { folderId, deleteContents };
  }
);

export const renameItemAsync = createAsyncThunk(
  'notes/renameItem',
  async ({ itemId, newName, type, folderId, subfolderId }) => {
    if (type === 'folder') {
      const response = await renameFolder({ folderId: itemId, name: newName });
      return { itemId, newName, type, folderId, subfolderId };
    } else {
      const response = await updateNote({ noteId: itemId, title: newName });
      return { itemId, newName, type, folderId, subfolderId };
    }
  }
);

export const createNoteAsync = createAsyncThunk(
  'notes/createNote',
  async ({ folderId, subfolderId, noteData }) => {
    const response = await createNote({ folderId, subfolderId, ...noteData });
    return { folderId, subfolderId, note: response.data };
  }
);

export const createFolderAsync = createAsyncThunk(
  'notes/createFolder',
  async ({ folderData, parentFolderId = null }) => {
    const response = await createFolder({ ...folderData, parentFolderId });
    return { folder: response.data, parentFolderId };
  }
);

export const createSubfolderAsync = createAsyncThunk(
  'notes/createSubfolder',
  async ({ parentFolderId, subfolderData }) => {
    const response = await createFolder({ ...subfolderData, parentFolderId });
    return { subfolder: response.data, parentFolderId };
  }
);

export const moveItemAsync = createAsyncThunk(
  'notes/moveItem',
  async ({ sourceId, targetId, itemType, sourceFolderId, sourceSubfolderId }) => {
    if (itemType === 'note') {
      await moveNote({ noteId: sourceId, targetId });
    } else if (itemType === 'folder') {
      await moveFolder({ folderId: sourceId, targetId });
    }
    return { sourceId, targetId, itemType, sourceFolderId, sourceSubfolderId };
  }
);

const initialState = {
  folders: {},
  selectedNote: null,
  expandedFolders: {},
  loading: false,
  error: null
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    selectNote: (state, action) => {
      state.selectedNote = action.payload;
      localStorage.setItem('notesState', JSON.stringify(state));
    },
    toggleFolder: (state, action) => {
      state.expandedFolders[action.payload] = !state.expandedFolders[action.payload];
      localStorage.setItem('notesState', JSON.stringify(state));
    },
    updateNoteContent: (state, action) => {
      const { noteId, title, body } = action.payload;
      const findAndUpdateNote = (folders) => {
        for (const folder of Object.values(folders)) {
          const directNote = folder.notes.find(note => note.id === noteId);
          if (directNote) {
            directNote.title = title;
            directNote.body = body;
            directNote.lastModified = Date.now();
            directNote.isDirty = true;
            return;
          }
          for (const subfolder of Object.values(folder.subfolders)) {
            const subNote = subfolder.notes.find(note => note.id === noteId);
            if (subNote) {
              subNote.title = title;
              subNote.body = body;
              subNote.lastModified = Date.now();
              subNote.isDirty = true;
              return;
            }
          }
        }
      };
      findAndUpdateNote(state.folders);
      if (state.selectedNote && state.selectedNote.id === noteId) {
        state.selectedNote = { ...state.selectedNote, title, body, isDirty: true };
      }
      localStorage.setItem('notesState', JSON.stringify(state));
    },
    markNoteSaved: (state, action) => {
      const noteId = action.payload;
      const findAndMarkSaved = (folders) => {
        for (const folder of Object.values(folders)) {
          const directNote = folder.notes.find(note => note.id === noteId);
          if (directNote) {
            directNote.isDirty = false;
            return;
          }
          for (const subfolder of Object.values(folder.subfolders)) {
            const subNote = subfolder.notes.find(note => note.id === noteId);
            if (subNote) {
              subNote.isDirty = false;
              return;
            }
          }
        }
      };
      findAndMarkSaved(state.folders);
      if (state.selectedNote && state.selectedNote.id === noteId) {
        state.selectedNote = { ...state.selectedNote, isDirty: false };
      }
      localStorage.setItem('notesState', JSON.stringify(state));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotesAsync.fulfilled, (state, action) => {
        state.folders = action.payload;
        state.loading = false;
        localStorage.setItem('notesState', JSON.stringify(state));
      })
      .addCase(fetchNotesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateNoteAsync.fulfilled, (state, action) => {
        notesSlice.caseReducers.markNoteSaved(state, { payload: action.payload.noteId });
      })
      .addCase(deleteNoteAsync.fulfilled, (state, action) => {
        const { noteId, folderId, subfolderId } = action.payload;
        if (subfolderId) {
          state.folders[folderId].subfolders[subfolderId].notes = 
            state.folders[folderId].subfolders[subfolderId].notes.filter(note => note.id !== noteId);
        } else {
          state.folders[folderId].notes = 
            state.folders[folderId].notes.filter(note => note.id !== noteId);
        }
        if (state.selectedNote && state.selectedNote.id === noteId) {
          state.selectedNote = null;
        }
        localStorage.setItem('notesState', JSON.stringify(state));
      })
      .addCase(deleteFolderAsync.fulfilled, (state, action) => {
        const { folderId } = action.payload;
        delete state.folders[folderId];
        if (state.selectedNote) {
          state.selectedNote = null;
        }
        localStorage.setItem('notesState', JSON.stringify(state));
      })
      .addCase(createNoteAsync.fulfilled, (state, action) => {
        const { folderId, subfolderId, note } = action.payload;
        if (subfolderId) {
          state.folders[folderId].subfolders[subfolderId].notes.push(note);
        } else {
          state.folders[folderId].notes.push(note);
        }
        localStorage.setItem('notesState', JSON.stringify(state));
      })
      .addCase(createFolderAsync.fulfilled, (state, action) => {
        const { folder, parentFolderId } = action.payload;
        if (parentFolderId) {
          // This is a subfolder
          if (!state.folders[parentFolderId].subfolders) {
            state.folders[parentFolderId].subfolders = {};
          }
          state.folders[parentFolderId].subfolders[folder.id] = {
            ...folder,
            notes: folder.notes || [],
            subfolders: folder.subfolders || {}
          };
        } else {
          // This is a main folder
          state.folders[folder.id] = {
            ...folder,
            notes: folder.notes || [],
            subfolders: folder.subfolders || {}
          };
        }
        localStorage.setItem('notesState', JSON.stringify(state));
      })
      .addCase(createSubfolderAsync.fulfilled, (state, action) => {
        const { subfolder, parentFolderId } = action.payload;
        if (!state.folders[parentFolderId].subfolders) {
          state.folders[parentFolderId].subfolders = {};
        }
        state.folders[parentFolderId].subfolders[subfolder.id] = {
          ...subfolder,
          notes: subfolder.notes || [],
          subfolders: subfolder.subfolders || {}
        };
        localStorage.setItem('notesState', JSON.stringify(state));
      })
      .addCase(renameItemAsync.fulfilled, (state, action) => {
        const { itemId, newName, type, folderId, subfolderId } = action.payload;
        if (type === 'folder') {
          if (subfolderId) {
            state.folders[folderId].subfolders[itemId].name = newName;
          } else {
            state.folders[itemId].name = newName;
          }
        } else if (type === 'note') {
          const findAndUpdateNote = (folders) => {
            for (const folder of Object.values(folders)) {
              const directNote = folder.notes.find(note => note.id === itemId);
              if (directNote) {
                directNote.title = newName;
                return;
              }
              for (const subfolder of Object.values(folder.subfolders)) {
                const subNote = subfolder.notes.find(note => note.id === itemId);
                if (subNote) {
                  subNote.title = newName;
                  return;
                }
              }
            }
          };
          findAndUpdateNote(state.folders);
        }
        localStorage.setItem('notesState', JSON.stringify(state));
      })
      .addCase(moveItemAsync.fulfilled, (state, action) => {
        const { sourceId, targetId, itemType, sourceFolderId, sourceSubfolderId } = action.payload;
        if (itemType === 'note') {
          let note = null;
          if (sourceSubfolderId) {
            const notes = state.folders[sourceFolderId].subfolders[sourceSubfolderId].notes;
            const index = notes.findIndex(n => n.id === sourceId);
            if (index !== -1) {
              note = notes.splice(index, 1)[0];
            }
          } else {
            const notes = state.folders[sourceFolderId].notes;
            const index = notes.findIndex(n => n.id === sourceId);
            if (index !== -1) {
              note = notes.splice(index, 1)[0];
            }
          }
          if (note) {
            if (targetId.includes('subfolder:')) {
              const [_, folderId, subfolderId] = targetId.split(':');
              state.folders[folderId].subfolders[subfolderId].notes.push(note);
            } else {
              state.folders[targetId].notes.push(note);
            }
          }
        } else if (itemType === 'folder') {
          const folder = state.folders[sourceId];
          delete state.folders[sourceId];
          state.folders[targetId].subfolders[sourceId] = folder;
        }
        localStorage.setItem('notesState', JSON.stringify(state));
      });
  }
});

export const { selectNote, toggleFolder, updateNoteContent, markNoteSaved } = notesSlice.actions;
export default notesSlice.reducer;