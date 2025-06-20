import { PrismaClient } from "../generated/prisma";
// Make sure the options object is correctly formatted
const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

export default prisma;
