import { useState, useCallback } from 'react';
import type { TastingSession, GuidedStep, VisualMode } from '../types';

const INITIAL_STATE: TastingSession = {
  selectedNoteIds: [],
  guidedStep: 'aroma',
  reverseQuery: '',
  mode: 'wheel',
};

export function useTastingSession() {
  const [session, setSession] = useState<TastingSession>(INITIAL_STATE);

  const toggleNote = useCallback((noteId: string) => {
    setSession(s => ({
      ...s,
      selectedNoteIds: s.selectedNoteIds.includes(noteId)
        ? s.selectedNoteIds.filter(id => id !== noteId)
        : [...s.selectedNoteIds, noteId],
    }));
  }, []);

  const setGuidedStep = useCallback((step: GuidedStep) => {
    setSession(s => ({ ...s, guidedStep: step }));
  }, []);

  const setReverseQuery = useCallback((query: string) => {
    setSession(s => ({ ...s, reverseQuery: query }));
  }, []);

  const setMode = useCallback((mode: VisualMode) => {
    setSession(s => ({ ...s, mode }));
  }, []);

  const reset = useCallback(() => setSession(INITIAL_STATE), []);

  return { session, toggleNote, setGuidedStep, setReverseQuery, setMode, reset };
}
