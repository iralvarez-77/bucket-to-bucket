const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  console.log('EVENT', JSON.stringify(event));
  
  const bucketName = 'Nombre del primer bucket';
  const bucketNameDos = 'Nombre del segundo bucket'; 
  
  try {

    const listObjectsResponse = await s3.listObjectsV2({
      Bucket: bucketName,
      // Prefix: 'oldFolder/',   
      MaxKeys: 100
    }).promise();

    // console.log('listObjectsResponse', listObjectsResponse);

    const folderContentInfo = listObjectsResponse.Contents;
    // const folderPrefix = listObjectsResponse.Prefix;

    await Promise.all(
      folderContentInfo.map( async ( fileInfo ) => {
        // console.log(fileInfo);
        await s3.copyObject({
          Bucket: bucketNameDos,
          CopySource: `${bucketName}/${fileInfo.Key}`,
          Key: `${fileInfo.Key}`,
          ACL: "public-read",
        }).promise();

        await s3.deleteObject({
          Bucket: bucketName,
          Key: fileInfo.Key,
        }).promise();

      })
    );

  } catch (error) {
    console.log('Error', error);
  }
};