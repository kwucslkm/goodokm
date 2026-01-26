module.exports = {
  apps: [
    {
      name: "goodokm-front",
      cwd: "/opt/goodokm/frontend",
      script: "pnpm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      },
      out_file: "/opt/goodokm/logs/front.out.log",
      error_file: "/opt/goodokm/logs/front.err.log",
      time: true,
    }
,
    {
      name: "goodokm-back",
      cwd: "/opt/goodokm/backend",
      script: "java",
      args: "-Xms256m -Xmx512m -jar /opt/goodokm/backend/app.jar --server.port=8081",
      env: {
        SPRING_PROFILES_ACTIVE: "prod",
        APP_CORS_ALLOWED_ORIGINS:
          "https://goodokm.kwucsalabs.dedyn.io,http://localhost:3000",
      },
      out_file: "/opt/goodokm/logs/back.out.log",
      error_file: "/opt/goodokm/logs/back.err.log",
      time: true,
    },
  ],
};
