import { SVEType } from './schedule.const';
import { TaskCopy } from '../tasks/task.model';
import { TaskRepeatCfg } from '../task-repeat-cfg/task-repeat-cfg.model';
import { CalendarIntegrationEvent } from '../calendar-integration/calendar-integration.model';

export interface ScheduleEvent {
  id: string;
  title: string;
  type: SVEType;
  style: string;
  startHours: number;
  timeLeftInHours: number;
  data?: SVE['data'];
}

export interface ScheduleDay {
  dayDate: string;
  entries: SVE[];
  beyondBudgetTasks: TaskCopy[];
  isToday: boolean;
}

interface SVEBase {
  id: string;
  type: SVEType;
  start: number;
  timeToGo: number;
}

export interface SVETask extends SVEBase {
  type: SVEType.Task | SVEType.TaskPlannedForDay | SVEType.ScheduledTask;
  data: TaskCopy;
}

export interface SVESplitTaskStart extends SVEBase {
  type: SVEType.SplitTaskPlannedForDay | SVEType.SplitTask;
  data: TaskCopy;
}

export interface SVETaskPlannedForDay extends SVEBase {
  type: SVEType.TaskPlannedForDay;
  data: TaskCopy;
}

interface SVERepeatProjectionBase extends SVEBase {
  data: TaskRepeatCfg;
}

export interface SVEScheduledRepeatProjection extends SVERepeatProjectionBase {
  type: SVEType.ScheduledRepeatProjection;
}

export interface SVERepeatProjection extends SVERepeatProjectionBase {
  type: SVEType.RepeatProjection;
}

export interface SVERepeatProjectionSplit extends SVERepeatProjectionBase {
  type: SVEType.RepeatProjectionSplit;
}

export interface SVERepeatProjectionSplitContinued extends SVEBase {
  type:
    | SVEType.RepeatProjectionSplitContinued
    | SVEType.RepeatProjectionSplitContinuedLast;
  data: {
    title: string;
    repeatCfgId: string;
    index: number;
  };
}

export interface SVESplitTaskContinued extends SVEBase {
  type: SVEType.SplitTaskContinued | SVEType.SplitTaskContinuedLast;
  data: {
    title: string;
    taskId: string;
    projectId: string | null;
    index: number;
  };
}

export interface ScheduleFromCalendarEvent extends CalendarIntegrationEvent {
  icon?: string;
}

export interface ScheduleCustomEvent
  extends Omit<ScheduleFromCalendarEvent, 'calProviderId'> {
  icon: string;
}

interface SVECalendarEvent extends SVEBase {
  type: SVEType.CalendarEvent;
  data: ScheduleCustomEvent;
}

export interface ScheduleWorkStartEndCfg {
  startTime: string;
  endTime: string;
}

export type ScheduleLunchBreakCfg = ScheduleWorkStartEndCfg;

interface SVEWorkStart extends SVEBase {
  type: SVEType.WorkdayStart;
  data: ScheduleWorkStartEndCfg;
}

interface SVEWorkEnd extends SVEBase {
  type: SVEType.WorkdayEnd;
  data: ScheduleWorkStartEndCfg;
}

interface SVELunchBreak extends SVEBase {
  type: SVEType.LunchBreak;
  data: ScheduleLunchBreakCfg;
}

export type SVE =
  | SVETask
  | SVESplitTaskStart
  | SVETaskPlannedForDay
  | SVEScheduledRepeatProjection
  | SVERepeatProjection
  | SVERepeatProjectionSplit
  | SVERepeatProjectionSplitContinued
  | SVESplitTaskContinued
  | SVECalendarEvent
  | SVEWorkStart
  | SVEWorkEnd
  | SVELunchBreak;
