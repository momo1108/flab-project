// Category: Person profile and credits queries
export const popularPersonsQueryKey = (page: number) => ['persons', 'popular', page] as const;
export const personCreditsQueryKey = (personId: number) => ['person', 'credits', personId] as const;
