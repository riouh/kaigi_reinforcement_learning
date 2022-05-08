import ioClient from "socket.io-client";
const ENDPOINT = "http://localhost:3000";

export const io = ioClient(ENDPOINT, {
  rejectUnauthorized: false // WARN: please do not do this in production
});
