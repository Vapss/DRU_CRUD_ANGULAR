import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { HttpService } from '../../../core/services/http.service';
import { HabitsMessage } from '../../../shared/models/habit.model';

@Injectable({ providedIn: 'root' })
export class HabitsService {
  constructor(private readonly http: HttpService) {}

  getWelcomeMessage() {
    return this.http.get<HabitsMessage>('/habits/').pipe(map((response) => response.message));
  }
}
