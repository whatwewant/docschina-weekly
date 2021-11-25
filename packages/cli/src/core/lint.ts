import { inquirer, api, doreamon, Logger } from '@cliz/cli';
import config from '../config';
import { setLastestPeriod, getLastestPeriod } from './common';

export async function start(period: number | undefined, logger: Logger) {
  const branch = `lint/${period}`;

  logger.info('拉取远程更新 ...');
  await api.$`git checkout ${config.branch.master}`;
  await api.$`git fetch origin`;
  await api.$`git merge origin/${config.branch.master}`;

  if (!period) {
    const files = await api.fs.listDir(config.docsDir);
    const docs: { period: number; isTranslated: boolean; createdAt: any }[] =
      await Promise.all(
        files
          // md only
          .filter((e) => /\.md$/.test(e.name))
          // calculate period, isTranslated, and createdAt
          .map(async (file) => {
            const stat = await api.fs.stat(file.absolutePath);

            const content = await api.fs.readFile(file.absolutePath, {
              encoding: 'utf-8',
            });
            const isTranslated = /> 编辑/.test(content.slice(0, 512));

            return {
              period: +file.name.replace('.md', ''),
              isTranslated,
              createdAt: doreamon.date(stat.ctimeMs).format('YYYY-MM-DD'),
            } as { period: number; isTranslated: boolean; createdAt: any };
          }),
      );

    const periods = docs
      .sort((a, b) => {
        return b.period - a.period;
      })
      .map((e) => {
        return {
          // name: `第 ${e.period} 期 - ${e.isTranslated ? '已翻译' : '待翻译'}`, // `${e.period}（${e.createdAt}）`,
          name: `第 ${e.period} 期`,
          value: e.period,
        };
      });

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'period',
        message: '请选择期数',
        choices: periods,
        default: periods[0],
        loop: false,
      },
    ]);

    period = answers.period;
  }

  logger.info(`切换到 Lint 分支 ${branch} ...`);

  try {
    await api.$`git rev-parse --verify ${branch}`;
    await api.$`git checkout ${branch}`;
  } catch (error) {
    await api.$`git checkout -b ${branch} origin/${config.branch.master}`;
  }

  logger.info('更新最新分支数据 ...');
  try {
    await setLastestPeriod(period);
  } catch (error) {
    logger.error(`请确认当前路径是否在翻译根目录`);
    process.exit(1);
  }

  logger.info('✅ 请开始你的 Lint');
}

export async function commit(logger: Logger) {
  let period: number;

  try {
    period = await getLastestPeriod();
  } catch (error) {
    logger.error(`请确认当前路径是否在翻译根目录`);
    process.exit(1);
  }

  logger.info('1. 添加最新期数 ...');
  await api.$`git add .LATEST`;

  logger.info(`2. 添加 ${period}.md ...`);
  await api.$`git add docs/${period}.md`;

  logger.info('3. 添加备注 ...');
  await api.$`git commit -m \"chore(lint): ${period}.md, remove the AD, job, sponsor and useless blank lines\"`;

  logger.info('4. ✅ 提交 Lint 完成 ...');
}

export async function pr(logger: Logger) {
  let period: number;

  try {
    period = await getLastestPeriod();
  } catch (error) {
    logger.error(`请确认当前路径是否在翻译根目录`);
    process.exit(1);
  }

  const branch = `lint/${period}`;

  try {
    await api.$`which gh`;
  } catch (error) {
    logger.error(
      `Github CLI not found, please install from https://cli.github.com/`,
    );
    process.exit(1);
  }

  logger.info('1. 提交分支到远程 ...');
  await api.$`git push origin ${branch}`;

  logger.info('2. 发起 PR ...');
  await api.$`gh pr create -w -t \"chore(lint): ${period}.md, remove the AD, job, sponsor and useless blank lines\" -b 'See Files'`;

  logger.info('3. ✅ 发起 PR 完成，请在浏览器端操作');
}
