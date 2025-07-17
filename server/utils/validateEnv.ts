export const validateEnv = () => {
  const requiredVars = ["MONGO_URI", "JWT_SECRET"];

  const missingVars = requiredVars.filter((key) => !process.env[key]);
  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
  }
};
