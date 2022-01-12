const aws = require('aws-sdk');
const ec2 = new aws.EC2({ region: 'us-east-1' });
const _ = require('lodash');

const instanceNameTag = process.argv[2];
console.log(`instanceNameTag: ${instanceNameTag}`);
let displayInstances = [];
const params = {
  Filters: [
     {
    Name: "tag:Name", 
    Values: [
      instanceNameTag
    ]
   }
  ]
 };

ec2.describeInstances(params, (err, data) => {
  if (err) console.log('ERROR: ' + err);
  let reservations = data.Reservations;
  console.log('==========');
  for (const reservation of reservations) {
    for (const instance of reservation.Instances) {
      displayInstances.push({
        State: instance.State.Name,
        ID: instance.InstanceId,
        AMI: instance.ImageId
      });
    }
  }
  let amiIds = _.reduce(displayInstances, (o, v) => {
    let output = o || [];
    if(o.indexOf(v.AMI) === -1) output.push(v.AMI);
    return output;
  }, []);
  if (amiIds.length > 0) {
    let params = {
      ImageIds: amiIds
    };
    ec2.describeImages(params, (err, data) => {
      if (err) console.log('ERROR: ' + err);
      let idNameMap = _.reduce(data.Images, (o, v) => {
        o = o || {};  // Need to finish turning this into a reduce
        o[v.ImageId] = v.Name;
        return o;
      }, []);
      for (let instance of displayInstances) {
        let amiName = idNameMap[instance.AMI];
        console.log(`ID: ${instance.ID}`);
        console.log(`State: ${instance.State}`);
        console.log(`AMI: ${instance.AMI} (${amiName})`);
        console.log('==========');
      }
    })
  }
})
