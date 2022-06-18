const {
    S3Client,
    HeadObjectCommand
} = require('@aws-sdk/client-s3');
const { InvalidError } = require('common-lib/exception');
const { getS3ObjectUrl } = require('common-lib/utils/resource-utils');
const RoomService = require("./service/room-type-service");

const s3Client = new S3Client();
const service = new RoomService();

const getBucketMetadata = async (bucket, key) => {
    // geting object metadata
    const parms = {
        Bucket: bucket,
        Key: key,
    };
    const command = new HeadObjectCommand(parms);
    const response = await s3Client.send(command);
    return response.Metadata;
}

exports.handler = async function (event, context) {
    console.log("event", JSON.stringify(event));
    try {
        const records = event['Records'];
        if (records.length === 0) {
            throw new InvalidError('empty records');
        }
        const record = records[0]; // take first entry
        const awsRegion = record.awsRegion
        const bucket = record.s3.bucket.name;
        const key = record.s3.object.key;
        const { roomtypeid, field } = await getBucketMetadata(bucket, key);
        await service.updateImageResource(roomtypeid, field, getS3ObjectUrl(awsRegion, bucket, key));
        console.log("successfully updated")
    } catch (err) {
        console.error('handler execution failed', err);
    }
}