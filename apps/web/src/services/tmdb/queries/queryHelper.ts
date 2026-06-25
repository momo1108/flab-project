type WithResults<TItem> = {
  results: TItem[];
};

/**
 * Creates a select function for limiting the number of results in a query.
 * @param limit The maximum number of results to return.
 * @returns A function that takes the query data and returns the data with limited results.
 */
export const createResultsLimitSelect = <TItem, TData extends WithResults<TItem>>(limit?: number) => {
  return (data: TData): TData => {
    if (typeof limit !== 'number' || !Number.isInteger(limit) || limit < 0) {
      return data;
    }

    return {
      ...data,
      results: data.results.slice(0, limit),
    };
  };
};
