import { defineSubCommand } from '@cliz/cli';
import core from '../../core';

export default defineSubCommand((createCommand) => {
  return createCommand('translate-weekly translate pr').action(
    async ({ logger }) => {
      await core.translate.pr(logger);
    },
  );
});
