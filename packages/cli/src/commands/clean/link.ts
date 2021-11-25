import { defineSubCommand } from '@cliz/cli';
import core from '../../core';

export default defineSubCommand((createCommand) => {
  return createCommand('translate-weekly clean link')
    .argument('<period>', 'Docs period')
    .action(async ({ args, logger }) => {
      if (args.period === 'latest') {
        args.period = await core.period.latest(logger);
      }

      await core.fmt.link(args.period as any, logger);
    });
});
