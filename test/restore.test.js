'use strict';
const fs = require('fs');
const mm = require('egg-mock');
const assert = require('assert');
const utils = require('./utils');

describe('test/config-reload', () => {
  let app;
  before(() => {
    mm.env('local');
    app = mm.app({
      baseDir: 'config-restore',
    });
    return app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should restore the original config when custom config is removed', async () => {
    assert(app.config.test === true);

    const filePath = app.config.extraConfig.paths;
    const backupContent = fs.readFileSync(filePath);
    after(() => fs.writeFileSync(filePath, backupContent));

    const testContent = 'module.exports = {};';
    fs.writeFileSync(filePath, testContent);
    await utils.sleep(500);
    assert(app.config.test === false);
  });
});
