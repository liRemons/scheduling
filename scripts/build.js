const { execSync } = require("child_process");
const command = `webpack --mode=production`;
execSync(command, { stdio: "inherit" });
