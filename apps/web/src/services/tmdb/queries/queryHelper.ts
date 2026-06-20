type WithResults<TItem> = {
  results: TItem[];
};

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
