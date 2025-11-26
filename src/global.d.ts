import { Connection } from "mongoose";
// database step-1
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}
export {};
