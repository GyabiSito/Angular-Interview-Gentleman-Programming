import { inject, InjectionToken } from "@angular/core";
import { Character } from '../models/character.model';
import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals"
import { CharactersService } from "../services/character.service";
import { lastValueFrom } from "rxjs";
import { addEntity, removeEntity, updateEntity, withEntities } from "@ngrx/signals/entities";
type StoreState = {
    characters: Character[];
}

const initialState: StoreState = {
    characters: []
}

const STORE_STATE = new InjectionToken<StoreState>("GlobalStore", {
    factory: () => initialState
});

export const GlobalStore = signalStore(
    { providedIn: "root" },
    withState(() => inject(STORE_STATE)),
    withEntities<Character>(),
    withMethods((store, charactersService = inject(CharactersService)) => ({
        getCharacter(id: number) {
            return store.characters().find((char) => char.id === id);
        },

        async addCharacter(character: Omit<Character, 'id'>) {
            try {
                await lastValueFrom(charactersService.addCharacter(character));

                patchState(store, ({ characters }) => ({
                    characters: [
                        ...characters,
                        { id: new Date().getTime(), ...character },
                    ],
                }));
            } catch (error) { }
        },


        async removeCharacter(id: number) {
            try {
                await lastValueFrom(charactersService.removeCharacter(id));

                patchState(store, ({ characters }) => ({
                    characters: characters.filter((char) => char.id !== id),
                }));
            } catch (error) { }
        },
        async updateCharacter(character: Character) {
            // Update the local store first
            patchState(store, ({ characters }) => ({
                characters: characters.map((char) =>
                    char.id === character.id ? { ...char, ...character } : char
                ),
                isLoading: false,
            }));

            try {
                // Attempt to update on the external API (which we know will fail)
                await lastValueFrom(charactersService.updateCharacter(character));
            } catch (error) {
                console.error('Error updating character on server:', error);
            }
        }

    })),
    withHooks({
        async onInit(store, characterService = inject(CharactersService)) {
            try {
                const characters = await lastValueFrom(characterService.getAllCharacters());
                patchState(store, { characters });
            } catch (error) {
                console.error('Error fetching characters:', error);
            }
        }
    })

);