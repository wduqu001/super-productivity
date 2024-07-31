import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ScheduleEvent } from '../schedule.model';
import { MatIcon } from '@angular/material/icon';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectProjectById } from '../../project/store/project.selectors';
import { BaseComponent } from '../../../core/base-component/base.component';
import { MatMiniFabButton } from '@angular/material/button';
import { getClockStringFromHours } from '../../../util/get-clock-string-from-hours';
import { SVEType } from '../schedule.const';
import { isDraggableSE } from '../map-schedule-data/is-schedule-types-type';

@Component({
  selector: 'schedule-event',
  standalone: true,
  imports: [MatIcon, MatMiniFabButton],
  templateUrl: './schedule-event.component.html',
  styleUrl: './schedule-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleEventComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input({ required: true })
  set event(event: ScheduleEvent) {
    this.se = event;
    this.startClockString = getClockStringFromHours(this.se.startHours);
    this.durationStr = (this.se.timeLeftInHours * 60).toString().substring(0, 4);

    if (isDraggableSE(this.se)) {
      this._elRef.nativeElement.id = 't-' + (this.se.data as any).id;
    }
  }

  startClockString: string = '';
  durationStr: string = '';

  se!: ScheduleEvent;

  @HostBinding('class') get cssClass(): string {
    // console.log('CLASS');

    let addClass = '';
    if (this.isSplitContinued) {
      addClass = 'split-continued';
    } else if (this.isSplitContinuedLast) {
      addClass = 'split-continued-last';
    } else if (this.isSplitStart) {
      addClass = 'split-start';
    }

    return this.se?.type + '  ' + addClass;
  }

  @HostBinding('style') get style(): string {
    return this.se?.style;
  }

  get isSplitStart(): boolean {
    return (
      this.se?.type === SVEType.SplitTask ||
      this.se?.type === SVEType.RepeatProjectionSplit ||
      this.se?.type === SVEType.SplitTaskPlannedForDay
    );
  }

  get isSplitContinued(): boolean {
    return (
      this.se?.type === SVEType.SplitTaskContinued ||
      this.se?.type === SVEType.RepeatProjectionSplitContinued
    );
  }

  get isSplitContinuedLast(): boolean {
    return (
      this.se?.type === SVEType.SplitTaskContinuedLast ||
      this.se?.type === SVEType.RepeatProjectionSplitContinuedLast
    );
  }

  get icoType():
    | 'REPEAT'
    | 'FLOW'
    | 'SCHEDULED_TASK'
    | 'PLANNED_FOR_DAY'
    | 'CAL_PROJECTION'
    | 'SPLIT_CONTINUE'
    | 'LUNCH_BREAK' {
    switch (this.se?.type) {
      case SVEType.RepeatProjection:
      case SVEType.RepeatProjectionSplit: {
        return 'REPEAT';
      }
      case SVEType.TaskPlannedForDay:
      case SVEType.SplitTaskPlannedForDay: {
        return 'PLANNED_FOR_DAY';
      }
      case SVEType.Task:
      case SVEType.SplitTask: {
        return 'FLOW';
      }
      case SVEType.CalendarEvent: {
        return 'CAL_PROJECTION';
      }
      case SVEType.ScheduledTask: {
        return 'SCHEDULED_TASK';
      }
      case SVEType.LunchBreak: {
        return 'LUNCH_BREAK';
      }
    }
    return 'SPLIT_CONTINUE';
  }

  protected readonly SVEType = SVEType;

  constructor(
    private _store: Store,
    private _elRef: ElementRef,
  ) {
    super();
  }

  ngOnInit(): void {
    const pid = (this.se?.data as any)?.projectId;
    if (
      this.se.type === SVEType.SplitTask ||
      this.se.type === SVEType.Task ||
      this.se.type === SVEType.SplitTaskPlannedForDay ||
      this.se.type === SVEType.TaskPlannedForDay
    ) {
    }

    if (pid) {
      this._store
        .select(selectProjectById, { id: pid })
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((p) => {
          console.log('SET COLOR');

          this._elRef.nativeElement.style.setProperty('--project-color', p.theme.primary);
        });
    }
  }
}
