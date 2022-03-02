import ioClient from "socket.io-client";
const ENDPOINT = "http://localhost:3002";

export const io = ioClient(ENDPOINT, {
  rejectUnauthorized: false // WARN: please do not do this in production
});
