'use strict'
const awsXRay = require('aws-xray-sdk')
const S3 = require('aws-sdk/clients/s3')

const s3Client = awsXRay.captureAWSClient(new S3())

module.exports.fetchFileFor = async (event, res, callback) => {
  const request = JSON.parse(event.body)
  const {projectId, config, windDirection} = request

  const params = {
    Bucket: 'fetch-files-for',
    Key: `data/${projectId}/${config}/${windDirection}.mat`
  }
  console.log("params", params)
  // await s3Client.getObject(params, function(err, data) {
  //   console.log('getObject', err, data)
  //   if (err) console.log(err, err.stack); // an error occurred
  //   else     {
  //     fileData = data;
  //   }           // successful response
  // });
  const fileData = await s3Client.getObject(params).promise()
  console.log(fileData, fileData.ContentType)
  const contentType = fileData.ContentType
  const body = fileData.Body.toString('base64')

  callback(null, {
    statusCode: 200,
    body,
    headers: {
      'Content-Type': contentType,
      "Content-Disposition": `inline; filename=\"${windDirection}.mat\"`
    },
    isBase64Encoded: true
  })

}
