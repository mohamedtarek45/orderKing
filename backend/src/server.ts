import app from "./app";

async function start() {
  try {
    await app.listen({
      port: 3000,
      host: "0.0.0.0",
    });

    console.log("Server running on port 3000");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

start();