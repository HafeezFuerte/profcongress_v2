const cron = require('node-cron');
// const UserService = require('./UserService');
const moment = require('moment-timezone');
const { getAllCategories } = require('./category');


// cron.schedule('*/5 * * * *', () => {  // Runs every minute
//   console.log("cron run")
//   console.log(moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'))

//   UserService.getFirstUser((err, firstUser) => {
//     if (err) {
//         console.log("cron run")

//       // console.error('Error running cron job:', err);
//       return;
//     }
//     // console.log('First user:', firstUser);
//   });
// });

cron.schedule('*/5 * * * *', async () => {
  try {
    const categories = await getAllCategories();
    console.log('Categories:', categories);
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});