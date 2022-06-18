import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import {getResourceName} from "../utils/common-utils";

export class S3EventSourceMappingConstructor {
    constructor(id: string, sourceS3: aws.s3.Bucket, targetFunc: aws.lambda.Function, filterPrefix?: string, filterSuffix?: string) {
        const allowBucket = new aws.lambda.Permission(getResourceName(`${id}-s3-lambda`), {
            action: "lambda:InvokeFunction",
            "function": targetFunc.arn,
            principal: "s3.amazonaws.com",
            sourceArn: sourceS3.arn,
        });
        return new aws.s3.BucketNotification(getResourceName(`${id}-s3-notify`), {
            bucket: sourceS3.id,
            lambdaFunctions: [{
                lambdaFunctionArn: targetFunc.arn,
                events: ["s3:ObjectCreated:*"],
                filterPrefix,
                filterSuffix,
            }],
        }, {
            dependsOn: [allowBucket],
        });
    }
}