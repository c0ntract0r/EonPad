/*
 * DEFINE HERE BACKEND API ENDPOINTS - HEALTH CHECK NOT NECESSARY
 */

import API from "../services/api"

export const login = async (data) => {
    return await API.post("/api/v1/login", data);
}

export const register = async (data) => {
    return await API.post("/api/v1/register", data);
}

// Get all of user's notes from the database
export const getAllNotes = async (data) => {
    return await API.get("/api/v1/notes", data);
}

// With + button, create a new note
export const createNote = async (data) => {
    return await API.post("/api/v1/notes", data);

}

// Delete the selected note
export const deleteNote = async (data) => {
    return await API.delete("/api/v1/notes/noteId", data);
}

// Update note - both title and body
export const updateNote = async (data) => {
    return await API.patch("/api/v1/notes/noteId", data);
}


// Move note to a new place
export const moveNote = async (data) => {
    return await API.patch("/api/v1/notes/move/noteId", data);
}


export const createFolder = async (data) => {
    return await API.post("/api/v1/folders", data);
}

// Delete a folder, optionally with all of it's content
export const deleteFolder = async (data) => {
    return await API.delete("/api/v1/folders/folderId", data);
}

// Rename a folder
export const renameFolder = async (data) => {
    return await API.patch("/api/v1/folders/folderId", data);
}

// Move a folder to a new place
export const moveFolder = async (data) => {
    return await API.patch("/api/v1/folders/move/folderId", data);
}
