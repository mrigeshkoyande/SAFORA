const { PrismaClient } = require('@prisma/client');

/**
 * Creates a new PrismaClient instance with optional configurations.
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    // Optional: Add logging for debugging
    // log: ['query', 'info', 'warn', 'error'],
  });
};

/**
 * Global Prisma Client instance.
 * @type {PrismaClient}
 */
// In development, attach the Prisma instance to the global object to prevent 
// creating multiple instances and exhausting database connections during nodemon reloads.
const prisma = global.prismaGlobal || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}

// Graceful error handling: ensure Prisma disconnects safely before exiting
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Handle termination signals gracefully
const gracefulShutdown = async () => {
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during Prisma disconnect:', error);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Export the singleton Prisma instance
module.exports = prisma;
