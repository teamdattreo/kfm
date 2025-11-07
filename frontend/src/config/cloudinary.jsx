// src/config/cloudinary.js
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'your-actual-cloud-name', 
    apiKey: 'your-api-key', 
    apiSecret: 'your-api-secret' 
  }
});

export default cld;


// import { Cloudinary } from '@cloudinary/url-gen';

// const cld = new Cloudinary({
//   cloud: {
//     cloudName: dks6odzfo, 
//     apiKey: 966213146516139, 
//     apiSecret: wg53JkL7vFtcFz_HxGKGv7rKNg8 
//   }
// });

// export default cld;


// cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'MISSING',
//   api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'

//   CLOUDINARY_CLOUD_NAME=dks6odzfo
// CLOUDINARY_API_KEY=966213146516139
// CLOUDINARY_API_SECRET=wg53JkL7vFtcFz_HxGKGv7rKNg8
