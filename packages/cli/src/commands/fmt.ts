import { defineSubCommand } from '@cliz/cli';
import core from '../core';

export default defineSubCommand((createCommand) => {
  return createCommand('translate-weekly fmt').action(async ({ logger }) => {
    await core.fmt.fmt(logger);
  });
});
