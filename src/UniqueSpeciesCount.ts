import {isSpeciesMessage, Message, SpeciesMessage} from "@/api/MessagesApi";

export function countNumberOfUniqueSpecies(messages: Message[]): number {
    return [...new Set(messages.filter(message => isSpeciesMessage(message)).map(message => (message as SpeciesMessage).species))].length;
}
