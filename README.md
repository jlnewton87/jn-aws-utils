# State of Project

- list-instances-for-stack.js
  - This script works - should probably make it requireable, and let the output be different based on context


  This project did not go as planned.  I believe there are stacks that are getting automaitically deleted/created, which makes this code not work.  Also, the inconsitency of tags being added to the instances is a real problem.  Maybe the cloudformation templates should have a spot for the tags, and a default value (for each team).  At least that way there would be some way to automatically generate a list of of stacks owned by a given team.
