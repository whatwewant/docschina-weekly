import { api, Logger } from '@cliz/cli';

import config from '../config';

export interface Post {
  period: number;
  title: string;
  banner: string;
}

export interface Data {
  latest: Post;
  histories: Post[];
}

export async function release(
  period: number,
  latestPost: Post,
  logger: Logger,
) {
  // update home data
  const { latest, histories } = await api.fs.json.load(config.dataPath);

  const originLatestPeriod = parseInt(latest.title);
  // console.log(originLatestPeriod, period);
  if (originLatestPeriod >= period) {
    throw new Error(`第 ${period} 已发布，请检查后再发布`);
  }

  const _lastest = latestPost;
  const _histories: Post[] = [latest, ...histories].sort((a, b) => {
    return parseInt(b.title) - parseInt(a.title);
  });

  const _data = {
    latest: _lastest,
    histories: _histories,
  };

  await api.fs.writeFile(config.dataPath, JSON.stringify(_data, null, 2), {
    encoding: 'utf-8',
  });

  logger.info('4. 提交发布内容 ...');
  await api.$`git add .`;
  await api.$`git commit -m "chore: release ${period}"`;

  const tag = `@translate/${period}`;
  logger.info(`5. 创建发布版本: ${tag} ...`);
  await api.$`git tag ${tag}`;

  logger.info('6. 开始发布 ...');
  await api.$`git push origin ${tag}`;
  await api.$`git push origin ${config.branch.master}`;

  logger.info('7. ✅ 发布完成');
}

export async function getLatestPost(period: number): Promise<Post> {
  const titleRegex = /^title:([^\n]+)/m;
  const bannerRegex = /!\[\]\(([^\]]+)\)/m;

  const currentMdPath = api.path.join(config.docsDir, `${period}.md`);
  const text = await api.fs.readFile(currentMdPath, { encoding: 'utf-8' });

  if (!titleRegex.test(text)) {
    throw new Error(`title[1]: Cannot found title in docs/${period}.md`);
  }
  const title = titleRegex.exec(text)?.[1]?.split('-')?.[1]?.trim();
  if (!title) {
    throw new Error(`title[2]: Cannot found title in docs/${period}.md`);
  }

  if (!bannerRegex.test(text)) {
    throw new Error(`banner[1]: Cannot found banner in docs/${period}.md`);
  }
  const banner = bannerRegex.exec(text)?.[1];
  if (!banner) {
    throw new Error(`banner[2]: Cannot found banner in docs/${period}.md`);
  }

  return {
    period,
    title,
    banner,
  };
}
