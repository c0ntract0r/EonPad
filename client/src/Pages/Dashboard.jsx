import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronDown, ChevronRight, Folder, Plus, MoreHorizontal,
        Edit, Trash2, FolderPlus, RefreshCw, AlertCircle,LogOut } from 'lucide-react';
import {
  FaUser,
  FaFolder,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { BsFileText } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { redirect } from 'react-router';

// Import your actions and components
import {
  fetchNotesAsync,
  toggleFolder,
  selectNote,
  createNoteAsync,
  createFolderAsync,
  deleteNoteAsync,
  deleteFolderAsync,
  renameItemAsync } from '../features/notes/noteSlice';
import { logoutUser } from '../features/user/userSlice'
import useAutoSave  from '../hooks/useAutoSave'
import { NoteEditor, ConfirmationModal, DroppableFolder, DraggableNote } from '../Components';

const Dashboard = () => {
  useAutoSave();
  const dispatch = useDispatch();
  
  // Fixed user access - based on your localStorage structure
   // state.userState.user
  const userState = useSelector(state => state.userState.user || {});
  const user = userState; // The user object is directly in the state, not nested
  
  console.log('[Dashboard] Full userState:', userState);
  console.log('[Dashboard] User object:', user);
  console.log('[Dashboard] User token:', user?.token);
  
  const notesState = useSelector(state => state.notes || {});
  
  const { 
    folders = {}, 
    expandedFolders = {}, 
    loading = false, 
    error = null 
  } = notesState;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: '',
    item: null,
    folderId: null,
    subfolderId: null
  });

  useEffect(() => {
    // Fetch notes when component mounts if user has token
    console.log('[Dashboard] useEffect - checking user token:', user?.token);
    if (user?.token) {
      console.log('[Dashboard] Fetching notes for user:', user.user);
      dispatch(fetchNotesAsync());
    } else {
      console.log('[Dashboard] No token found, user needs to login');
    }
  }, [dispatch, user?.token]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const handleToggleFolder = (folderId) => {
    dispatch(toggleFolder(folderId));
  };

  const handleMenuClick = (e, itemId, type) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === itemId ? null : itemId);
  };

  const handleNoteClick = (note) => {
    dispatch(selectNote(note));
    setActiveMenu(null);
  };

  const handleCreateNote = async (folderId = null, subfolderId = null) => {
    console.log('[Dashboard] handleCreateNote - user:', user);
    console.log('[Dashboard] handleCreateNote - token:', user?.token);
    
    if (!user?.token) {
      console.error('[Dashboard] No token available for note creation');
      toast.error('Authentication required to create notes.');
      return;
    }

    const title = prompt('Enter note title:');
    if (title?.trim()) {
      const noteData = {
        title: title.trim(),
        body: 'Start writing your note here...',
        folderId,
        subfolderId
      };
      
      console.log('[Dashboard] Creating note with data:', noteData);
      try {
        const result = await dispatch(createNoteAsync({ folderId, subfolderId, noteData }));
        console.log('[Dashboard] Note creation result:', result);
        if (result.error) {
          console.error('[Dashboard] Note creation failed:', result.error);
          toast.error('Failed to create note: ' + result.error.message);
        } else {
          console.log('[Dashboard] Note created successfully');
          toast.success('Note created successfully!');
        }
      } catch (error) {
        console.error('[Dashboard] Note creation error:', error);
        toast.error('Failed to create note');
      }
    }
    setActiveMenu(null);
  };

  const handleCreateFolder = async () => {
    console.log('[Dashboard] handleCreateFolder - user:', user);
    console.log('[Dashboard] handleCreateFolder - token:', user?.token);
    
    if (!user?.token) {
      console.error('[Dashboard] No token available for folder creation');
      toast.error('Authentication required to create folders.');
      return;
    }

    const name = prompt('Enter folder name:');
    if (name?.trim()) {
      const folderData = { name: name.trim() };
      console.log('[Dashboard] Creating folder with data:', folderData);
      
      try {
        const result = await dispatch(createFolderAsync({ folderData }));
        console.log('[Dashboard] Folder creation result:', result);
        if (result.error) {
          console.error('[Dashboard] Folder creation failed:', result.error);
          toast.error('Failed to create folder: ' + result.error.message);
        } else {
          console.log('[Dashboard] Folder created successfully');
          toast.success('Folder created successfully!');
        }
      } catch (error) {
        console.error('[Dashboard] Folder creation error:', error);
        toast.error('Failed to create folder');
      }
    }
  };

  const handleCreateSubfolder = async (parentFolderId) => {
    console.log('[Dashboard] handleCreateSubfolder - user:', user);
    console.log('[Dashboard] handleCreateSubfolder - token:', user?.token);
    console.log('[Dashboard] handleCreateSubfolder - parentFolderId:', parentFolderId);
    
    if (!user?.token) {
      console.error('[Dashboard] No token available for subfolder creation');
      toast.error('Authentication required to create subfolders.');
      return;
    }

    const name = prompt('Enter subfolder name:');
    if (name?.trim()) {
      const subfolderData = { name: name.trim() };
      console.log('[Dashboard] Creating subfolder with data:', subfolderData);
      
      try {
        const result = await dispatch(createSubfolderAsync({ 
          parentFolderId, 
          subfolderData 
        }));
        console.log('[Dashboard] Subfolder creation result:', result);
        if (result.error) {
          console.error('[Dashboard] Subfolder creation failed:', result.error);
          toast.error('Failed to create subfolder: ' + result.error.message);
        } else {
          console.log('[Dashboard] Subfolder created successfully');
          toast.success('Subfolder created successfully!');
        }
      } catch (error) {
        console.error('[Dashboard] Subfolder creation error:', error);
        toast.error('Failed to create subfolder');
      }
    }
    setActiveMenu(null);
  };

  const showDeleteConfirmation = (itemId, type, folderId, subfolderId = null) => {
    const isFolder = type === 'folder';
    setConfirmDialog({
      isOpen: true,
      type,
      item: itemId,
      folderId,
      subfolderId,
      title: `Delete ${isFolder ? 'Folder' : 'Note'}`,
      message: `Are you sure you want to delete this ${isFolder ? 'folder' : 'note'}? This action cannot be undone.`,
      showDeleteContents: isFolder
    });
    setActiveMenu(null);
  };

  const handleConfirmDelete = async (deleteContents = false) => {
    console.log('[Dashboard] handleConfirmDelete - user:', user);
    console.log('[Dashboard] handleConfirmDelete - token:', user?.token);
    
    if (!user?.token) {
      console.error('[Dashboard] No token available for deletion');
      toast.error('Authentication required to delete items.');
      return;
    }

    const { type, item, folderId, subfolderId } = confirmDialog;
    console.log('[Dashboard] Deleting item:', { type, item, folderId, subfolderId, deleteContents });
    
    try {
      let result;
      if (type === 'note') {
        result = await dispatch(deleteNoteAsync({ 
          noteId: item, 
          folderId, 
          subfolderId
        }));
      } else if (type === 'folder') {
        result = await dispatch(deleteFolderAsync({ 
          folderId: item, 
          deleteContents
        }));
      }
      
      console.log('[Dashboard] Delete result:', result);
      if (result.error) {
        console.error('[Dashboard] Delete failed:', result.error);
        toast.error('Failed to delete: ' + result.error.message);
      } else {
        console.log('[Dashboard] Delete successful');
        toast.success('Item deleted successfully!');
      }
    } catch (error) {
      console.error('[Dashboard] Delete error:', error);
      toast.error('Failed to delete item');
    }
    
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const handleRename = async (itemId, currentName, type, folderId, subfolderId = null) => {
    console.log('[Dashboard] handleRename - user:', user);
    console.log('[Dashboard] handleRename - token:', user?.token);
    
    if (!user?.token) {
      console.error('[Dashboard] No token available for rename');
      toast.error('Authentication required to rename items.');
      return;
    }

    const newName = prompt(`Enter new ${type} name:`, currentName);
    if (newName?.trim() && newName.trim() !== currentName) {
      console.log('[Dashboard] Renaming item:', { itemId, newName, type, folderId, subfolderId });
      
      try {
        const result = await dispatch(renameItemAsync({ 
          itemId, 
          newName: newName.trim(), 
          type, 
          folderId, 
          subfolderId
        }));
        
        console.log('[Dashboard] Rename result:', result);
        if (result.error) {
          console.error('[Dashboard] Rename failed:', result.error);
          toast.error('Failed to rename: ' + result.error.message);
        } else {
          console.log('[Dashboard] Rename successful');
          toast.success('Item renamed successfully!');
        }
      } catch (error) {
        console.error('[Dashboard] Rename error:', error);
        toast.error('Failed to rename item');
      }
    }
    setActiveMenu(null);
  };

  const handleLogout = () => {
    console.log('[Dashboard] Logging out user');
    dispatch(logoutUser());
    setUserMenuOpen(false);
  };

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <div className="mb-4">
        <FaFolder size={48} className="mx-auto text-base-content/50 mb-2" />
        <p className="text-base-content/70 mb-4">No folders or notes yet</p>
        <p className="text-base-content/50 text-sm mb-6">Get started by creating your first folder or note</p>
      </div>
      <div className="space-y-2">
        <button 
          onClick={handleCreateFolder}
          className="btn btn-primary btn-sm w-full"
        >
          <FiPlus size={16} />
          Create Your First Folder
        </button>
        <button 
          onClick={() => handleCreateNote()}
          className="btn btn-outline btn-sm w-full"
        >
          <BsFileText size={16} />
          Create a Quick Note
        </button>
      </div>
    </div>
  );

  const renderFolder = (folder, folderId) => {
    const isExpanded = expandedFolders[folderId] || false;
    const hasContent = (folder.notes && folder.notes.length > 0) || 
                      (folder.subfolders && Object.keys(folder.subfolders).length > 0);

    return (
      <DroppableFolder key={folderId} folder={folder} folderId={folderId}>
        <div className="mb-2">
          <div className="flex items-center justify-between p-2 hover:bg-base-200 rounded cursor-pointer">
            <div className="flex items-center flex-1" onClick={() => handleToggleFolder(folderId)}>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Folder size={16} className="mx-2 text-primary" />
              <span className="text-sm font-medium">{folder.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={(e) => { e.stopPropagation(); handleCreateNote(folderId); }} 
                className="btn btn-ghost btn-xs"
                title="Add Note"
              >
                <Plus size={14} />
              </button>
              <div className="relative">
                <button onClick={(e) => handleMenuClick(e, folderId, 'folder')} className="btn btn-ghost btn-xs">
                  <MoreHorizontal size={14} />
                </button>
                {activeMenu === folderId && (
                  <div className="dropdown dropdown-end">
                    <ul className="menu dropdown-content bg-base-100 rounded-box shadow-lg p-1 min-w-32 z-50">
                      <li>
                        <button onClick={() => handleCreateSubfolder(folderId)}>
                          <FolderPlus size={14} />
                          Add Subfolder
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleCreateNote(folderId)}>
                          <Plus size={14} />
                          Add Note
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleRename(folderId, folder.name, 'folder', folderId)}>
                          <Edit size={14} />
                          Rename
                        </button>
                      </li>
                      <li>
                        <button className="text-error" onClick={() => showDeleteConfirmation(folderId, 'folder', folderId)}>
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          {isExpanded && (
            <div className="ml-4 border-l border-base-300 pl-4">
              {/* Render subfolders */}
              {Object.entries(folder.subfolders || {}).map(([subId, subfolder]) => (
                <DroppableFolder key={subId} folder={subfolder} folderId={`subfolder:${folderId}:${subId}`}>
                  <div className="mb-2">
                    <div className="flex items-center justify-between p-2 hover:bg-base-200 rounded">
                      <div className="flex items-center flex-1">
                        <Folder size={14} className="mr-2 text-secondary" />
                        <span className="text-sm">{subfolder.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => handleCreateNote(folderId, subId)} 
                          className="btn btn-ghost btn-xs"
                          title="Add Note"
                        >
                          <Plus size={12} />
                        </button>
                        <div className="relative">
                          <button onClick={(e) => handleMenuClick(e, `sub-${subId}`, 'subfolder')} className="btn btn-ghost btn-xs">
                            <MoreHorizontal size={12} />
                          </button>
                          {activeMenu === `sub-${subId}` && (
                            <div className="dropdown dropdown-end">
                              <ul className="menu dropdown-content bg-base-100 rounded-box shadow-lg p-1 min-w-32 z-50">
                                <li>
                                  <button onClick={() => handleCreateNote(folderId, subId)}>
                                    <Plus size={12} />
                                    Add Note
                                  </button>
                                </li>
                                <li>
                                  <button onClick={() => handleRename(subId, subfolder.name, 'subfolder', folderId, subId)}>
                                    <Edit size={12} />
                                    Rename
                                  </button>
                                </li>
                                <li>
                                  <button className="text-error" onClick={() => showDeleteConfirmation(subId, 'folder', folderId, subId)}>
                                    <Trash2 size={12} />
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {(subfolder.notes || []).length === 0 && (
                        <div className="text-center py-2">
                          <p className="text-base-content/50 text-xs mb-2">No notes in this subfolder</p>
                          <button 
                            onClick={() => handleCreateNote(folderId, subId)}
                            className="btn btn-ghost btn-xs"
                          >
                            <Plus size={12} />
                            Add First Note
                          </button>
                        </div>
                      )}
                      {(subfolder.notes || []).map(note => (
                        <DraggableNote
                          key={note.id}
                          note={note}
                          folderId={folderId}
                          subfolderId={subId}
                          onNoteClick={handleNoteClick}
                          onMenuClick={handleMenuClick}
                          activeMenu={activeMenu}
                          onDeleteNote={(noteId, fId, sId) => showDeleteConfirmation(noteId, 'note', fId, sId)}
                        />
                      ))}
                    </div>
                  </div>
                </DroppableFolder>
              ))}
              
              {/* Show empty state for folder if no content */}
              {!hasContent && (
                <div className="text-center py-4">
                  <p className="text-base-content/50 text-xs mb-3">This folder is empty</p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleCreateNote(folderId)}
                      className="btn btn-ghost btn-xs w-full"
                    >
                      <Plus size={12} />
                      Add Note
                    </button>
                    <button 
                      onClick={() => handleCreateSubfolder(folderId)}
                      className="btn btn-ghost btn-xs w-full"
                    >
                      <FolderPlus size={12} />
                      Add Subfolder
                    </button>
                  </div>
                </div>
              )}
              
              {/* Render notes in main folder */}
              {(folder.notes || []).map(note => (
                <DraggableNote
                  key={note.id}
                  note={note}
                  folderId={folderId}
                  onNoteClick={handleNoteClick}
                  onMenuClick={handleMenuClick}
                  activeMenu={activeMenu}
                  onDeleteNote={(noteId, fId) => showDeleteConfirmation(noteId, 'note', fId)}
                />
              ))}
            </div>
          )}
        </div>
      </DroppableFolder>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-base-content/70">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <div className="text-center">
          <div className="text-error mb-4">
            <AlertCircle size={48} className="mx-auto mb-2" />
            <p className="text-lg font-semibold">Error Loading Notes</p>
          </div>
          <p className="text-base-content/70 mb-4">{error}</p>
          <button
            onClick={() => user?.token && dispatch(fetchNotesAsync())}
            className="btn btn-primary"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-base-100">
        {/* Sidebar */}
        <div className={`flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-base-200 border-r border-base-300`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            {sidebarOpen && (
              <div className="relative">
                <button onClick={toggleUserMenu} className="btn btn-ghost btn-circle">
                  <FaUser size={20} className="text-primary" />
                </button>
                {userMenuOpen && (
                  <div className="dropdown dropdown-end">
                    <ul className="menu dropdown-content bg-base-100 rounded-box shadow-lg p-1 min-w-48 z-50">
                      <li>
                        <div className="px-4 py-2 text-sm text-base-content/70 border-b border-base-300">
                          <div className="font-semibold">{user?.user || 'User'}</div>
                          <div className="text-xs opacity-70">Signed in</div>
                        </div>
                      </li>
                      <li>
                        <button className="text-error" onClick={handleLogout}>
                          <LogOut size={16} /> 
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            <button onClick={toggleSidebar} className="btn btn-ghost btn-circle">
              {sidebarOpen ? <FaChevronDown size={16} /> : <FaChevronRight size={16} />}
            </button>
          </div>
          
          {/* Sidebar Content */}
          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {Object.keys(folders).length === 0 ? (
                  renderEmptyState()
                ) : (
                  <>
                    {/* Create buttons when folders exist */}
                    <div className="mb-4 space-y-2">
                      <button 
                        onClick={handleCreateFolder}
                        className="btn btn-primary btn-sm w-full"
                      >
                        <FolderPlus size={16} />
                        New Folder
                      </button>
                      <button 
                        onClick={() => handleCreateNote()}
                        className="btn btn-outline btn-sm w-full"
                      >
                        <Plus size={16} />
                        Quick Note
                      </button>
                    </div>
                    {/* Render folders */}
                    <div className="space-y-1">
                      {Object.entries(folders).map(([folderId, folder]) => renderFolder(folder, folderId))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <NoteEditor />
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={handleConfirmDelete}
          title={confirmDialog.title}
          message={confirmDialog.message}
          showDeleteContents={confirmDialog.showDeleteContents}
        />
      </div>
    </DndProvider>
  );
};


export default Dashboard;

export const loader = (store) => () => {
  const userState = store.getState().userState;
  console.log(userState.user);
  const user = userState.user;

  // Check if user exists and has a token
  if (!user || !user.token) {
    toast.warn('You must be logged in to access your dashboard.');
    return redirect('/login');
  }

  return null;
};