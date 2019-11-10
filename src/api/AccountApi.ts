import {postRequest} from "./HttpMethods";

export let AccountApi = {
    register(username: string, password: string): Promise<void> {
        return postRequest("/api/v1/account/register", {username, password})
    },
    login(username: string, password: string): Promise<boolean> {
        return postRequest("/api/v1/account/login", {username, password})
    },
    logout(username: string): Promise<void> {
        return postRequest("/api/v1/account/logout", {username})
    }
};
