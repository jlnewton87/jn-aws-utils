const fs = require('fs');
const aws = require('aws-sdk');
const cloudFormation = new aws.CloudFormation({ region: 'us-east-1' });

const fileName = process.argv[2] || './stackNames.json';
let stacks = [];
let stackNames = [];

let getStacks = (err, data) => {
  console.log('Running...');
  if (err) console.log(`ERROR: \n ${err}`);
  for(const stack of data.StackSummaries) {
    if (stack.StackStatus !== 'DELETE_COMPLETE') {
      stackNames.push(stack.StackName);
    }
  }
  if (data.NextToken) {
    cloudFormation.listStacks({NextToken: data.NextToken}, getStacks);
  }
  fs.writeFileSync(fileName, JSON.stringify(stackNames));
}

cloudFormation.listStacks({}, getStacks);

