import { api, Logger } from '@cliz/cli';

export async function latest(logger: Logger) {
  const files = await api.fs.listDir(api.path.join(process.cwd(), 'docs'));
  const latest = files
    .map((e) => +e.name.match(/(\d+)\.md/)[1])
    .reduce((l, c) => (l >= c ? l : c), -1);

  return latest;
}
