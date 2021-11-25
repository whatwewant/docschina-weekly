import { api } from '@cliz/cli';

export async function getLastestPeriodFilePath() {
  const latestPeriodFilePath = api.path.join(process.cwd(), '.LATEST');
  if (!(await api.fs.isExist(latestPeriodFilePath))) {
    throw new Error(`请确认当前路径是否在翻译根目录`);
  }

  return latestPeriodFilePath;
}

export async function getLastestPeriod() {
  const latestPeriodFilePath = await getLastestPeriodFilePath();
  return +(await api.fs.readFile(latestPeriodFilePath, {
    encoding: 'utf-8',
  }));
}

export async function setLastestPeriod(period: number) {
  const latestPeriodFilePath = await getLastestPeriodFilePath();
  await api.fs.writeFile(latestPeriodFilePath, period + '\n', {
    encoding: 'utf-8',
  });
}
