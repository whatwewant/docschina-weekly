import { defineSubCommand } from '@cliz/cli';
import core from '../../core';

export default defineSubCommand((createCommand) => {
  return createCommand('translate-weekly lint commit').action(
    async ({ logger }) => {
      await core.lint.commit(logger);
    },
  );
});
