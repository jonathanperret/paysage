'use strict';

const debug = require('debug')('paysage:persistence');

let s3;

if (process.env.S3_BUCKET) {
  const AWS = require('aws-sdk');

  s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: process.env.S3_BUCKET }
  });
}

module.exports = {
  setup: function (playground) {
    if (!s3) return;

    let ignoreUpdates = false;

    s3.listObjectsV2({
      Prefix: `${playground.id}/`
    }, function (err, data) {
      if (err) {
        console.log('S3 list failed', err, err.stack);
        return;
      }

      debug(`found ${data.Contents.length} stored objects`);
      data.Contents.forEach(function (obj) {
        debug(`loading ${obj.Key}`);
        s3.getObject({
          Key: obj.Key
        }, function (err, data) {
          if (err) {
            console.log('S3 GET failed', err, err.stack);
            return;
          }

          debug(`got data from ${obj.Key}`);

          try {
            const body = data.Body.toString('utf-8');
            const objectData = JSON.parse(body);

            const codeObject = playground
              .getOrCreateCodeObject(objectData.codeObjectId);

            ignoreUpdates = true;
            try {
              codeObject.setData(objectData);
            } catch (e) {
            }
            ignoreUpdates = false;
          } catch (err) {
            console.log(`failed to process ${obj.Key}`, err, err.stack);
          }
        });
      });
    });

    playground.on('codeObjectUpdated', function (codeObject) {
      if (!ignoreUpdates) {
        debug(`sending ${playground.id}/${codeObject.id}.json to S3`);
        s3.putObject({
          Key: `${playground.id}/${codeObject.id}.json`,
          Body: JSON.stringify(codeObject.getData())
        }, function (err, data) {
          if (err) console.log('S3 PUT failed', err, err.stack);
          else debug('S3 PUT done');
        });
      }
    });

    playground.on('codeObjectDeleted', function (codeObject) {
      debug(`deleting ${playground.id}/${codeObject.id}.json in S3`);
      s3.deleteObject({
        Key: `${playground.id}/${codeObject.id}.json`
      }, function (err, data) {
        if (err) console.log('S3 DELETE failed', err, err.stack);
        else debug('S3 DELETE done');
      });
    });
  }
};
