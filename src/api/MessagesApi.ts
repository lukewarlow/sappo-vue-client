import {getRequest, postRequest} from "./HttpMethods";

export let MessagesApi = {
    retrieveMessages(): Promise<Message[]> {
        return getRequest("/api/v1/messages");
    },
    sendMessage(message: Message): Promise<void> {
        return postRequest("/api/v1/messages", message);
    }
};

export interface Message {
    username: string,
    content: string,
    timestamp: Date
}

export interface SpeciesMessage extends Message {
    latitude: number,
    longitude: number,
    species: string,
    abundance: number,
    temperature: number,
    image: string
}

export function isSpeciesMessage(message: Message): message is SpeciesMessage {
    return 'species' in message;
}

export function emptyMessage(username: string): Message {
    return {
        username: username,
        content: "",
        timestamp: new Date()
    }
}

export function emptySpeciesMessage(species: string): SpeciesMessage {
    return {
        abundance: 0,
        content: "",
        image: "",
        latitude: 0,
        longitude: 0,
        species: species,
        temperature: 0,
        timestamp: new Date(),
        username: ""
    }
}
