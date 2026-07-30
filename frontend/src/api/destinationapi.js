import axiosInstance from "./axios";

// GET api /gloomvalutview
export const getDestinations = async () => {
    const response = await axiosInstance.get("gloomvalutview/");
    return response.data;

};

// GET /api gloomvalut/api:id
export const getdestination = async () => {
    const response = await axiosInstance.get(`gloomvalutview/${id}`);
    return response.data;
};

// POST /api GLOOMVALUTVIEW
export const createDestination = async (data) => {
    const response = await axiosInstance.post("gloomvalutview/",data);
    return response.data;
};

//PUT /api gloomvalutview
export const updateDestination = async (id, data) => {
    const response = await axiosInstance.put(
        `gloomvalutview/${id}/`,
        data
    );
    return response.data;
};

//DELETE /api gloomvalutview
export const deleteDestination = async (id) => {
    const response = await axiosInstance.delete(
        `gloomvalutview/${id}/`,
    );
    return response.data;
};