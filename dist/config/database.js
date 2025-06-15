"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const prisma = globalThis.__prisma || new prisma_1.PrismaClient();
if (process.env.NODE_ENV === 'development') {
    globalThis.__prisma = prisma;
}
exports.default = prisma;
//# sourceMappingURL=database.js.map