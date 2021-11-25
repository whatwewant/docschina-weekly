import { defineSubCommand } from '@cliz/cli';
import core from '../../core';

export default defineSubCommand((createCommand) => {
  return createCommand('translate-weekly translate commit').action(
    async ({ logger }) => {
      await core.translate.commit(logger);
    },
  );
});
