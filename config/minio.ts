import env from '#start/env'


export default {
  endpoint: env.get("MINIO_ENDPOINT"),  // or your MinIO server address
  port: env.get("MINIO_PORT"),  // MinIO port
  useSSL: env.get("MINIO_USESSL"),  // set to true if using SSL
  accessKey: env.get("MINIO_ACCESSKEY"),  // Replace with your MinIO access key
  secretKey: env.get("MINIO_SECRETKEY"),  // Replace with your MinIO secret key
  bucketName: env.get("MINIO_BUCKETNAME"),  // Your MinIO bucket name
}

