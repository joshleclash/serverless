
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'joshsummer',
  applicationName: 'aws-node-express-dynamodb-api',
  appUid: 'cBWblYRYWBv3ZZRQ50',
  orgUid: 'f0ffbe26-5b62-4995-9868-0730fd2f48b0',
  deploymentUid: 'e17f2285-58ae-41bc-9b77-ca75e2d5fdc0',
  serviceName: 'aws-node-express-dynamodb-api',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '6.2.3',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'aws-node-express-dynamodb-api-dev-api', timeout: 6 };

try {
  const userHandler = require('./index.js');
  module.exports.handler = serverlessSDK.handler(userHandler.handler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}