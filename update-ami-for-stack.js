const _ = require('lodash');
const moment = require('moment');
const aws = require('aws-sdk');
const cf = new aws.CloudFormation({ region: 'us-east-1' });

let stackName = process.argv[2];
let amiId = process.argv[3];
let asgMinSize = process.argv[4] || 1;
let asgMaxSize = process.argv[5] || 1;

let timeStart = moment.now();
let changesetName = `AMIUpdate-JN-${timeStart}`;

let sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// TODO: This should inspect the stack before updating it.
// It properly set the ASG Min/Max and DesiredCapacity
// this may require a new template with Desired Capacity
// being a named param, so we can override it below.

let params = {
  ChangeSetName: changesetName,
  StackName: stackName,
  ChangeSetType: 'UPDATE',
  Description: `Update AMI to ${amiId}`,
  Parameters:[
    {
      ParameterKey: 'LaunchConfigAMI',
      ParameterValue: amiId
    },
    {
      ParameterKey: 'ASGMaxSize',
      ParameterValue: asgMaxSize
    },
    {
      ParameterKey: 'ASGMinSize',
      ParameterValue: asgMinSize
    },
    {
      ParameterKey: 'ELBCertificateId',
      UsePreviousValue: true 
    },
    {
      ParameterKey: 'InstanceKeyName',
      UsePreviousValue: true 
    },
    {
      ParameterKey: 'ELBFriendlyName',
      UsePreviousValue: true 
    },
    {
      ParameterKey: 'ASGSubnets',
      UsePreviousValue: true 
    },
    {
      ParameterKey: 'ASGIamInstanceProfile',
      UsePreviousValue: true 
    },
    {
      ParameterKey: 'ELBSecurityGroups',
      UsePreviousValue: true 
    },
    {
      ParameterKey: 'ELBSubnets',
      UsePreviousValue: true 
    },
    {
      ParameterKey: 'CodeDeployServiceRoleId',
      UsePreviousValue: true 
    },
    {
      ParameterKey: 'InstanceSecurityGroups',
      UsePreviousValue: true 
    },
  ],
  UsePreviousTemplate: true
};

cf.createChangeSet(params, async (err, data) => {
  if (err) console.log(err);
  changesetName = data.Id
  console.log('Change set created.  Waiting 10 seconds for creation to complete...');
  await sleep(10000);
  console.log('Executing...');
  cf.executeChangeSet({ ChangeSetName: changesetName }, (err, data) => {
    if(err) console.log('ERROR: ' + err);
    console.log(`==== Changeset: ${changesetName} Executed ====`);
    console.log(data);
  });
});
