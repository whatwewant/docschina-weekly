#!/usr/bin/env node

import { createMultiCommandsProgram } from '@cliz/cli';
import { binName, version, packageName } from './config';

const program = createMultiCommandsProgram(binName, __dirname, {
  version,
  packageName,
});

program.run();
