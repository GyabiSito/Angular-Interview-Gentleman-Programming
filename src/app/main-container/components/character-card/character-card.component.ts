import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Character } from '../../../models/character.model';
import { GlobalStore } from '../../../store/global.store';
import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [NgOptimizedImage, JsonPipe, RouterLink],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterCardComponent {
  character=input.required<Character>();
   readonly store=inject(GlobalStore);

   removeCharacter(id:number):void{
    this.store.removeCharacter(id); 
   }
}
