import { defineSubCommand } from '@cliz/cli';
import core from '../../core';

export default defineSubCommand((createCommand) => {
  return createCommand('translate-weekly translate start')
    .argument('period', 'Current period', {
      validator: /^\d+$/,
    })
    .action(async ({ args, logger }) => {
      const period = args.period as any as number;

      await core.translate.start(period, logger);
    });
});
