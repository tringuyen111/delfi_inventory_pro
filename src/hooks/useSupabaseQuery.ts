import { useState, useEffect, useCallback } from 'react';
import { supabase, formatSupabaseError } from '../utils/supabaseClient';

// A more specific type for the query builder would be ideal, but 'any' suffices for now.
type SupabaseQuery = any;

interface UseSupabaseQueryOptions {
  table: string;
  select?: string;
  orderBy?: { column: string; ascending: boolean };
  limit?: number;
  offset?: number;
  filter?: {
    term: string;
    columns: string[];
  };
}

interface QueryState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  totalCount: number | null;
}

export function useSupabaseQuery<T = any>(
  options: UseSupabaseQueryOptions
): QueryState<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query: SupabaseQuery = supabase
        .from(options.table)
        .select(options.select || '*', { count: 'exact' });

      // Apply search filter
      if (options.filter && options.filter.term) {
        const { term, columns } = options.filter;
        const orFilter = columns.map(column => `${column}.ilike.%${term}%`).join(',');
        query = query.or(orFilter);
      }
      
      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending,
        });
      }

      // Apply pagination
      if (options.limit) {
        query = query.range(
            options.offset ?? 0,
            (options.offset ?? 0) + options.limit - 1
        );
      }

      const { data: result, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setData(result as T[]);
      setTotalCount(count);
    } catch (err) {
      setError(formatSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [options.table, options.select, options.orderBy, options.limit, options.offset, options.filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, totalCount };
}
