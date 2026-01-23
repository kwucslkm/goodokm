module.exports = {
  apps: [
    {
      name: "goodokm-front",
      cwd: "/opt/goodokm/frontend",
      script: "pnpm",
      args: "run start -- --port 3000",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "goodokm-back",
      cwd: "/opt/goodokm/backend",
      script: "java",
      args: "-jar /opt/goodokm/backend/app.jar",
      env: {
        SPRING_PROFILES_ACTIVE: "prod",
      },
    },
  ],
};
