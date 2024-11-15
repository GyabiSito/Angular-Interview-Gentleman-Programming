import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GlobalStore } from '../store/global.store';
import { CharacterCardComponent } from "./components/character-card/character-card.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [CharacterCardComponent, RouterLink],
  templateUrl: './main-container.component.html',
  styleUrl: './main-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainContainerComponent {
  readonly store = inject(GlobalStore);

}
