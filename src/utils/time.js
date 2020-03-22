import moment from 'moment';

export const timeAgo = (date = new Date()) => {
  return moment(date).fromNow();
};

export const getTimeDate = (date = new Date()) => {
  return moment(date).format('DD/MM/YYYY [at] hh:mma');
};
