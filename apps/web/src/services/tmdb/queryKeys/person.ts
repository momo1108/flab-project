export const personKeys = {
  all: ['person'] as const,
  popularLists: () => [...personKeys.all, 'popular'] as const,
  popularList: (page: number) => [...personKeys.popularLists(), page] as const,
};
