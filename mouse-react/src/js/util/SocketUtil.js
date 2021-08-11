import io from 'socket.io-client';
import { SERVER_URL } from './System.js';

const DOMAIN = SERVER_URL;

export const SOCKET = io(DOMAIN, { transports: ['websocket']});