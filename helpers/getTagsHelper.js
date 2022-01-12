const aws = require('aws-sdk');
const cloudFormation = new aws.CloudFormation({ region: 'us-east-1' });

module.exports = async (stackName) => {
  console.log(`getting tags for ${stackName}`);
  return new Promise((res, rej) => {
    cloudFormation.describeStacks({ StackName: stackName }, (err, data) => {
    if (err) rej(err);
    console.log(data);
    res(data.Stacks[0].Tags);
    });
  })
};
