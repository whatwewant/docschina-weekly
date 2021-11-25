import { api } from '@cliz/cli';
import * as remark from 'remark';
import * as visit from 'unist-util-visit';
import realUrl from '@znode/real-url';

import { Logger } from '@caporal/core';

export async function fmt(logger: Logger) {
  const prettierConfigPath = api.path.join(
    __dirname,
    '../../config/prettier.config.js',
  );

  // logger.info(`prettier config: ${prettierConfigPath}`);

  await api.$`yarn prettier --write 'docs/**/*.{md,mdx}' --config ${prettierConfigPath}`;

  logger.info('✅  fmt done');
}

export async function link(period: number, logger: Logger) {
  logger.info(`fmt link start (period: ${period})`);

  const filePath = api.path.join(process.cwd(), `docs/${period}.md`);
  const mdContent = await api.fs.readFile(filePath, 'utf-8');

  await remark()
    .use(changeLink)
    .use({ settings: { bullet: '-', listItemIndent: 'one', rule: '-' } })
    .process(mdContent)
    .then((res) => {
      return api.fs.writeFile(filePath, String(res));
    });

  logger.info('✅  fmt link done');

  // 短链转长链
  function changeLink() {
    return async function transformer(tree: any, file: any) {
      const promises = [];
      (visit as any)(tree, 'link', visitor);
      await Promise.all(promises);
      return null;

      function visitor(node: { url: string }) {
        if (node.url) {
          const request = realUrl(node.url)
            .then((realUrl) => {
              logger.info(`${node.url} => ${realUrl}`);

              node.url = realUrl;
            })
            .catch((error) => {
              // logger.error('change link error: ', error);
              logger.error(
                `Fallback origin url => Cannot get real url for ${node.url}`,
              );
            });

          promises.push(request);
        }
      }
    };
  }
}
