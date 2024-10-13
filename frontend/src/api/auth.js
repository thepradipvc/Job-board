import axios from "axios";

export const login = async (loginInfo) => {
    return await axios.post("/api/users/login", loginInfo);
};

export const register = async (registerInfo) => {
    return await axios.post("/api/users/register", registerInfo);
};

export const getMe = async () => {
    const res = await axios.get("/api/users/me");
    return { isLoggedIn: res.status === 200, user: res.data };
};
