import {emptySpeciesMessage, SpeciesMessage} from "@/api/MessagesApi";
import {countNumberOfUniqueSpecies} from "@/UniqueSpeciesCount";

test("gets unique species count", () => {
    let speciesMessages: SpeciesMessage[] = [emptySpeciesMessage("Freddo"), emptySpeciesMessage("Kermit"), emptySpeciesMessage("Freddo")];
    let count = countNumberOfUniqueSpecies(speciesMessages);
    expect(count).toBe(2);
});
