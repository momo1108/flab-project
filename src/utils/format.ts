export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}분`;
  }

  return `${hours}시간 ${mins}분`;
};

export const formatRating = (rating: number): string => {
  return (rating * 10).toFixed(1);
};

export const getYearFromDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.getFullYear().toString();
};
