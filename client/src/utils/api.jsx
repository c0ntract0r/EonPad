import API from "../services/api"

export const login = async (data) => {
    return API.post("/api/v1/login", data);
}

export const register = async (data) => {
    return API.post("/api/v1/register", data);
}