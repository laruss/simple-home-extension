import Bun, { $ } from "bun";
import { parseArgs } from "util";
import { watch } from "fs";
import type { FSWatcher } from "fs";
import chalk from "chalk";

import "./cwd";
import { server, channel } from "./server";

const {
  values: { dir },
} = parseArgs({
  args: Bun.argv,
  strict: true,
  allowPositionals: true,
  options: {
    dir: {
      type: "string",
    },
  },
});

const directoriesToWatch = dir?.split(",").map((dir) => `./${dir}`) || [];

const runBuild = async () => $`bun run config/build.ts`;
await runBuild();

const directories = directoriesToWatch.join(", ");
const defaultWatchMessage = `Watching ${directories} directories for changes...`;

console.log(chalk.bold(defaultWatchMessage))

const watchers: FSWatcher[] = [];

let buildTimeout: ReturnType<typeof setTimeout> | null = null;
let isBuilding = false;

const debouncedBuild = (filename: string | null) => {
  // Ignore temp files
  if (filename?.endsWith("~") || filename?.startsWith(".")) return;

  if (buildTimeout) clearTimeout(buildTimeout);

  buildTimeout = setTimeout(async () => {
    if (isBuilding) return;
    isBuilding = true;

    console.log(chalk.bold.yellow.dim(`Changes detected in ${filename}`));

    try {
      await runBuild();
      console.log(chalk.bold.green("✔️ Updated build files"));
      server.publish(channel, Bun.env.CHROME_EXTENSION_ID as string);
    } catch (error) {
      console.log(chalk.bold.red("Build failed"));
    } finally {
      isBuilding = false;
      console.log(chalk.bold(defaultWatchMessage));
    }
  }, 100);
};

for (const directory of directoriesToWatch) {
  const watcher = watch(directory, { recursive: true }, (_, filename) => {
    debouncedBuild(filename);
  });

  watchers.push(watcher);
}

process.on("SIGINT", () => {
  for (const watcher of watchers) {
    watcher.close();
  }

  process.exit(0);
});
