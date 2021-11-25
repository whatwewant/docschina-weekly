import { resolve } from 'path';

const pkgPath = resolve(__dirname, '../package.json');
const pkg = require(pkgPath);

// prod
export const binName = 'translate-weekly';
export const version = pkg.version;
export const packageName = pkg.name;
export const repoDir = process.env.REPO_DIR || process.cwd();
export const docsDir = `${repoDir}/docs`;
export const dataPath = `${repoDir}/src/data.json`;

export const config = {
  version,
  binName,
  packageName,
  repoDir,
  docsDir,
  dataPath,
  branch: {
    master: 'main',
  },
};

if (process.env.NODE_ENV === 'development') {
  config.binName = 'yarn';
}

export default config;
