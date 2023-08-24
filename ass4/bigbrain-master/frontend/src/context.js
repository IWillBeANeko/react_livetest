import React, { createContext } from 'react';

export const initialValue = {
  page: 'out',
  email: '',
  password: '',
  name: '',
  token: '',
  error: '',
  quiz: [], // 是问题的集合
  id: '', // 其实ID是quiz的名字
  thumbnail: '',
  qname: '',
  qtype: '',
  qtime: '',
  qpoint: '',
  qimg: '',
  qvideo: '',
  qanswer1: '',
  qanswer2: '',
  qanswer3: '',
  qanswer4: '',
  qanswer5: '',
  qanswer6: '',
  qcorrect: [],
  session: '',
  flag: 0,
  player: 0,
};

export const Context = createContext(initialValue);
export const useContext = React.useContext;
