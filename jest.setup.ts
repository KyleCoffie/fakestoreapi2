import { TextEncoder, TextDecoder } from 'util';
import dotenv from "dotenv";
dotenv.config();

// @ts-ignore
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder;
}

// @ts-ignore
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
}