import openSocket from "socket.io-client";
import {Message} from "./MessagesApi";

const socket = openSocket("");

export function onUserConnects(callback: (user: string) => any) {
    socket.on('user-connected', (user: string) => callback(user));
}

export function onUserDisconnects(callback: (user: string) => any) {
    socket.on('user-disconnected', (user: string) => callback(user));
}

export function onNewMessage(callback: (message: Message) => any) {
    socket.on('new-message', (message: Message) => callback(message));
}
