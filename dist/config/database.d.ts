import { PrismaClient } from '../generated/prisma';
declare global {
    var __prisma: PrismaClient | undefined;
}
declare const prisma: PrismaClient<import("../generated/prisma").Prisma.PrismaClientOptions, never, import("@/generated/prisma/runtime/library").DefaultArgs>;
export default prisma;
//# sourceMappingURL=database.d.ts.map