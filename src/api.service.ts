import axios from 'axios';

export const betterCallDevApi = axios.create({ baseURL: 'https://api.better-call.dev/v1' });

export const bakingBadApi = axios.create({ baseURL: 'https://api.baking-bad.org/v2' });
