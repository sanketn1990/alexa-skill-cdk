import cdk = require('@aws-cdk/cdk');
import lambda = require('@aws-cdk/aws-lambda');
import codeCommit = require('@aws-cdk/aws-codecommit');
import codeBuild = require('@aws-cdk/aws-codebuild');
import s3 = require('@aws-cdk/aws-s3');
import fs = require('fs');
import { ServicePrincipal, PolicyStatement, PolicyStatementEffect } from '@aws-cdk/aws-iam';
import { LinuxBuildImage } from '@aws-cdk/aws-codebuild';


export class AlexaSkillNodejs810Construct extends cdk.Construct {

    constructor(parent: cdk.Construct, name: string, props: AlexaSkillNodejs810ConstructProps) {
        super(parent, name);
        
        /**
         * Create a code commit repository.
         */
        const repository = new codeCommit.Repository(this, 'SkillRepository', {
            repositoryName: props.skillName,
            description: 'Code Repository'
        });

        /**
         * Creating a lambda function for the skill.
         */
        const fn = new lambda.Function(this, 'MyFunction', {
            runtime: lambda.Runtime.NodeJS810,
            handler: 'index.handler',
            code: lambda.Code.inline('exports.handler = function(event, ctx, cb) { \n   console.log(event); \n}'),
        });

        /**
         * Adding invoke permission to Alexa app kit.
         */
        fn.addPermission('AlexaPermission', {
            eventSourceToken: props.skillId,
            principal: new ServicePrincipal('alexa-appkit.amazon.com'),
            action: 'lambda:InvokeFunction'
        });

        /**
         * Creating an S3 bucket for the skill.
         */
        const s3Bucket = new s3.Bucket(this, 'SkillBucket', {
            bucketName: props.skillId
        });

        /**
         * BuildSpec for the code build project.
         */
        const buildspecYml = fs.readFileSync('lib/buildspec.yml', 'utf-8');

        /**
         * Creating a code build project.
         */
        const codeBuildProject = new codeBuild.Project(this, 'SkillCodeBuildProject', {
            source: new codeBuild.CodeCommitSource({
                repository: repository
            }),
            cacheBucket: s3Bucket,
            environmentVariables: {
                'FunctionName': {
                    type: codeBuild.BuildEnvironmentVariableType.PlainText,
                    value: fn.functionName
                },
                'BuildSnapshotBucket': {
                    type: codeBuild.BuildEnvironmentVariableType.PlainText,
                    value: s3Bucket.bucketName
                }
            },
            buildSpec: buildspecYml,
            environment: {
                buildImage: LinuxBuildImage.UBUNTU_14_04_NODEJS_8_11_0
            }
        });

        /**
         * Giving read/write permission to lambda function and code build project.
         */
        s3Bucket.grantReadWrite(fn.role);
        s3Bucket.grantReadWrite(codeBuildProject.role);

        /**
         * Giving update function code permission to code build project.
         */
        const st = new PolicyStatement(PolicyStatementEffect.Allow);
        st.addAction('lambda:UpdateFunctionCode')
        st.addResource(fn.functionArn);
        codeBuildProject.addToRolePolicy(st);

        /**
         * Creating a code commit trigger for code build.
         */
        repository.onCommit('OnCommitToMaster', codeBuildProject, 'master');
        
      }

}

export interface AlexaSkillNodejs810ConstructProps extends cdk.StackProps {
    skillId: string;
    skillName: string;
}