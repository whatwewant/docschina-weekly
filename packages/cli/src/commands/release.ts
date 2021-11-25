import { defineSubCommand, inquirer, doreamon, api } from '@cliz/cli';

import config from '../config';
import core from '../core';

export default defineSubCommand((createCommand) => {
  return createCommand('translate-weekly release').action(
    async ({ logger }) => {
      logger.info(`1. 切换分支到 ${config.branch.master} ...`);
      await api.$`git checkout ${config.branch.master}`;

      logger.info('2. 拉取远程更新 ...');
      await api.$`git pull origin ${config.branch.master}`;

      logger.info('3. 选择发布期数 ...');
      const files = await api.fs.listDir(config.docsDir);
      const docs: {
        period: number;
        isTranslated: boolean;
        createdAt: any;
      }[] = await Promise.all(
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

      const period = answers.period as any as number;
      const post = await core.release.getLatestPost(period);

      await core.release.release(period, post, logger);
    },
  );
});
