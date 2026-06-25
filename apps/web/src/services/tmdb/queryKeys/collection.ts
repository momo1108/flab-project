export const collectionKeys = {
  all: ['collection'] as const,
  details: () => [...collectionKeys.all, 'detail'] as const,
  detail: (collectionId: number) => [...collectionKeys.details(), collectionId] as const,
};
