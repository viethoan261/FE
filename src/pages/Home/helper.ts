interface TransformedDate {
  date: number;
  month: string;
}

export const transformDate = (dateString: string): TransformedDate => {
  const date = new Date(dateString);
  const transformedDate: TransformedDate = {
    date: date.getDate(),
    month: new Intl.DateTimeFormat('vi-VN', { month: 'short' }).format(date)
  };

  return transformedDate;
};
