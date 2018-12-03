#!/usr/

import cdk = require('@aws-cdk/cdk');

import { AlexaSkillNodejs810Construct } from './AlexaSkillNodejs810Construct';

class AlexaSkillNodejs810ConstructStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const skillId = this.getContext("skillId");
    const skillName = this.getContext("skillName");

    if (skillId && skillName) {
      new AlexaSkillNodejs810Construct(this, 'AlexaSkillNodejs810Construct', {
        skillId: skillId,
        skillName: skillName
      });
    } else {
      throw new Error("SkillId and SkillName not passed as input argument");
    }
  }
}

const app = new cdk.App();

new AlexaSkillNodejs810ConstructStack(app, 'AlexaSkillNodejs810Stack');

app.run();
