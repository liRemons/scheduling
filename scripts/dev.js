const { execSync } = require("child_process");
const command = `webpack serve --mode=development`;
execSync(command, { stdio: "inherit" });
