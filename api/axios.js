import axios from 'axios';
import { getCookieToken } from '../../shared/Cookie/Cookie';

const baseURL = process.env.REACT_APP_SERVER_URL;

// const myToken = getCookieToken();

export const instance = axios.create({
  baseURL,
  headers: {
    'Cache-Control': 'no-cache',
    withCredentials: true,
  },
});


토큰에서 정보를 빼낼거다 => 유저정보
필요하면 만드시되 요청을 보낼 때 토큰세팅이 필요가 없다.