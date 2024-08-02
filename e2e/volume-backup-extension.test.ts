/**
 * Copyright 2024 Docker Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DesktopUI } from '@docker/extension-test-helper';
import { exec as originalExec } from 'child_process';
import { describe, beforeAll, afterAll, test } from '@jest/globals';
import * as util from 'util';

export const exec = util.promisify(originalExec);

let dashboard: DesktopUI;

beforeAll(async () => {
  if (process.env.SKIP_EXTENSION_IMAGE_BUILD != 'true') {
    console.log('starting building extension...');
    await exec(`projectcopacetic/copacetic-docker-desktop-extension:test`, {
      cwd: '../',
    });
    console.log('extension built');
  }
  // await exec(
  //   `docker container create --name e2e-test-container -v e2e-test-volume:/data hello-world`,
  // );
  // console.log('sample volume and container created');
  await exec(
    `docker extension install -f projectcopacetic/copacetic-docker-desktop-extension:test`,
  );
  console.log('extension installed');
});

afterAll(async () => {
  await dashboard?.stop();
  console.log('dashboard app closed');
  await exec(`docker extension uninstall projectcopacetic/copacetic-docker-desktop-extension:test`);
  console.log('extension uninstalled');
});

describe('Test Logs Explorer UI', () => {
  test('should display volumes and their size', async () => {
    dashboard = await DesktopUI.start();

    const eFrame = await dashboard.navigateToExtension(
      'projectcopacetic/copacetic-docker-desktop-extension',
    );

    console.log(eFrame);
  });
});