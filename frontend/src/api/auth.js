import apiInstance from "@/lib/api-instance";

export const login = async (loginInfo) => {
    return await apiInstance.post("/users/login", loginInfo);
};

export const register = async (registerInfo) => {
    return await apiInstance.post("/users/register", registerInfo);
};

export const getMe = async () => {
    const res = await apiInstance.get("/users/me");
    return { isLoggedIn: res.status === 200, user: res.data };
};

export const logout = async () => {
    await apiInstance.post("/users/logout");
    return "Logged out successfully";
}