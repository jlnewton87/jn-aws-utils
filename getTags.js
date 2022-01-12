const fs = require('fs');
const getTagsHelper = require('./helpers/getTagsHelper');

let fileName = process.argv[2] || './stackNames.json';
let stackNames = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
let stacks = [];

let processs = async () => {
  for (const stackName of stackNames) {
    let tags = await getTagsHelper(stackName);
    stacks.push({ StackName: stackName, Tags: JSON.stringify(tags) });
    console.log(stacks);
  }
}

processs();
