export type VisualMode = 'wheel' | 'aura' | 'type';

export type GuidedStep = 'aroma' | 'flavor' | 'finish';

export interface TastingSession {
  selectedNoteIds: string[];
  guidedStep: GuidedStep;
  reverseQuery: string;
  mode: VisualMode;
}
