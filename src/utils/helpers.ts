import _ from 'lodash';

export const randomArray = (number: number): number[] =>
  Array.from({ length: number }, (_, i) => i + 1);

export const formatCurrency = (number: number | undefined) => {
  if (!number) return '0';
  const formattedNumber =
    _.replace(_.round(number, 0).toString(), /\B(?=(\d{3})+(?!\d))/g, '.') +
    ' đ';
  return formattedNumber;
};

export const formatDateFromISOString = (string: string | undefined) => {
  if (!string) return '';
  return string.split('T')[0];
};

export const formatPhonenumber = (phone: string | undefined) => {
  if (!phone) return '';
  return _.replace(phone, /(\d{4})(\d{3})(\d{3})/, '$1.$2.$3');
};

export const removeVietnameseandLowercase = (word: string | undefined) => {
  if (!word) return '';
  return word
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export const validatePassword = (password: string | undefined) => {
  if (!password) return false;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordPattern.test(password);
};

export const validateEmail = (email: string | undefined) => {
  if (!email) return false;
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};
