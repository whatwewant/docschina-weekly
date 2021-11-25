import { defineSubCommand } from '@cliz/cli';
import core from '../../core';

export default defineSubCommand((createCommand) => {
  return createCommand('translate-weekly lint pr').action(
    async ({ logger }) => {
      await core.lint.pr(logger);
    },
  );
});
