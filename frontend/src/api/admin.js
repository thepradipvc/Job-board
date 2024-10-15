import apiInstance from "@/lib/api-instance";

export const addStudent = async (student) => {
    const res = await apiInstance.post("/admin/add-student", student);
    return res.data;
};

export const addCompany = async (company) => {
    const res = await apiInstance.post("/admin/add-company", company);
    return res.data;
}

export const getStats = async () => {
    const res = await apiInstance.get("/admin/stats");
    return res.data;
};

export const listStudents = async () => {
    const res = await apiInstance.get("/admin/students");
    return res.data;
}

export const listCompanies = async () => {
    const res = await apiInstance.get("/admin/companies");
    return res.data;
}