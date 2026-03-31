export type VisualMode = 'wheel' | 'type';

export type GuidedStep = 'aroma' | 'flavor' | 'finish';

export interface TastingSession {
  selectedNoteIds: string[];
  guidedStep: GuidedStep;
  reverseQuery: string;
  mode: VisualMode;
}
