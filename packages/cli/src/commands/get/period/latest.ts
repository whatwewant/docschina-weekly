import { defineSubCommand } from '@cliz/cli';
import core from '../../../core';

export default defineSubCommand((createCommand) => {
  return createCommand('translate-weekly get latest period').action(
    async ({ logger }) => {
      console.log(await core.period.latest(logger));
    },
  );
});
