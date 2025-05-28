import axios from 'services/axios.customize';

export const registerAPI = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = "/api/v1/user/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, phone })
}

export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password }, {
        headers: {
            delay: 3000
        }
    })
}

export const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 1000
        }
    })
}

export const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.post(urlBackend)
}

export const getUsersAPI = (query: string) => {
    const urlBackend = `/api/v1/user/${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend)
}

export const createUsersAPI = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = `/api/v1/user`;
    return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, phone })
}

export const bulkCreateUsersAPI = (data: { fullName: string, email: string, password: string, phone: string }[]) => {
    const urlBackend = `/api/v1/user/bulk-create`;
    return axios.post<IBackendRes<IResponseImport>>(urlBackend, data)
}

export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
    const urlBackend = "api/v1/user";
    return axios.put<IBackendRes<IRegister>>(urlBackend, { _id, fullName, phone })
}