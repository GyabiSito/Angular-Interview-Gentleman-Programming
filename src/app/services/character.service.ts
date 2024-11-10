import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { Character, CharacterInfo } from '../models/character.model';
import { CharacterAdapter } from '../adapters/character.adapter';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {
  private readonly baseUrl = 'https://rickandmortyapi.com/api/character';
  http = inject(HttpClient);

  getAllCharacters(): Observable<Character[]> {
    return this.http.get<CharacterInfo>(this.baseUrl).pipe(map(info => CharacterAdapter(info)))
  }
  addCharacter(character: Omit<Character, "id">): Observable<void> {
    return this.http.post<void>(this.baseUrl, { character }).pipe(
      catchError(() => {
        console.info('Error adding character');
        return Promise.resolve();
      })
    )
  }

  removeCharacter(id: number): Observable<void> {
    const url=`${this.baseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(() => {
        console.info('Error removing character');
        return Promise.resolve();
      })
    )
  }


  updateCharacter(character: Character): Observable<void> {
    const url = `${this.baseUrl}/${character.id}`;
    return this.http.put<void>(url, character).pipe(
      catchError((error) => {
        console.error("Error updating character:", error);
        return Promise.resolve();
      })
    );
  }
  
}
