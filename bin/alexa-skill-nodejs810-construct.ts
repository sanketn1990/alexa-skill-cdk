#!/usr/bin/env node
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');

class AlexaSkillNodejs810ConstructStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const queue = new sqs.Queue(this, 'AlexaSkillNodejs810ConstructQueue', {
      visibilityTimeoutSec: 300
    });

    const topic = new sns.Topic(this, 'AlexaSkillNodejs810ConstructTopic');

    topic.subscribeQueue(queue);
  }
}

const app = new cdk.App();

new AlexaSkillNodejs810ConstructStack(app, 'AlexaSkillNodejs810ConstructStack');

app.run();
