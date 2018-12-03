#Alexa-skill-nodejs810-construct
This is an application built on top of AWS CDK. Everytime a new Alexa skill is created it requires a backend with is a typically an AWS Lambda.

Setting up this infrastructure in an AWS account is often time consuming. Hence this application proves beneficial when you create a new skill and want to provision a AWS Lambda back-end for it.

This application is nothing but infrastructure as code written using AWS CDK.

When you run this application the following infrastructure will get created.
* `AWS CodeCommit Repository`: This is for you skill code to reside.
* `AWS CodeBuild Project`: This is responsible for building your skill code and uploading it to lambda.
* `AWS Lambda`: This is your skill endpoint.
* `AWS S3 Bucket`: This bucket can be used for using media artifacts in your skill.

#Code Deployment

This application sets up a Code Pipe for uploading latest of your changes to your AWS Lambda. Whenever you push any changes to the `master` branch of your AWS CodeCommit repository, it will trigger a code build which will build the code and upload it to the AWS Lambda endpoint.

DISCLAIMER: Remember once you push any change to the `master` branch, wait for the code build run to finish before pushing again on the `master` branch.

#Pre-Requisite 
* Install AWS CLI.
* Create an AWS IAM User with administrator priviledge and configure in your AWS CLI using `aws configure`.

#User Guide
* Use `cdk deploy -c skillId=<SkillId> -c skillName=<SkillName>` to deploy this stack to your configured AWS account/region.
* Go to https://console.aws.amazon.com/lambda/home,  copy the created function ARN and paste in the endpoint section of your skill on Alexa developer console.

# Useful commands

 * `cdk synth -c skillId=<SkillId> -c skillName=<SkillName>`    emits the synthesized CloudFormation template
 * `cdk diff`        compare deployed stack with current state
 * `cdk deploy -c skillId=<SkillId> -c skillName=<SkillName>`      deploy this stack to your default AWS account/region
