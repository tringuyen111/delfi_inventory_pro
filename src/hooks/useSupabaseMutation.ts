import { useState } from 'react';
import { supabase, formatSupabaseError } from '../utils/supabaseClient';

interface MutationState {
  loading: boolean;
  error: string | null;
}

export function useSupabaseMutation() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
  });

  const insert = async <T extends object>(table: string, data: Partial<T>) => {
    setState({ loading: true, error: null });
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      setState({ loading: false, error: null });
      return result as T;
    } catch (err) {
      const errorMsg = formatSupabaseError(err);
      setState({ loading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  };

  const update = async <T extends object>(table: string, id: string, data: Partial<T>) => {
    setState({ loading: true, error: null });
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setState({ loading: false, error: null });
      return result as T;
    } catch (err) {
      const errorMsg = formatSupabaseError(err);
      setState({ loading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  };

  const remove = async (table: string, id: string) => {
    setState({ loading: true, error: null });
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);

      if (error) throw error;
      setState({ loading: false, error: null });
    } catch (err) {
      const errorMsg = formatSupabaseError(err);
      setState({ loading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  };

  return {
    ...state,
    insert,
    update,
    remove,
  };
}
