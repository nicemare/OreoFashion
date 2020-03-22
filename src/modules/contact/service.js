import request from 'src/utils/request';

export const getContacts = () => request.get(`messages/contact`);
