import User from './models/User'; 

async function updateExistingUsers() {
  try {
    console.log(User.find({}));
    await User.updateMany(
      { salary: { $exists: false } }, // Filter documents without the salary field
      { $set: { salary: 0 } }        // Add the salary field with a default value of 0
    );
    console.log('All existing users updated with a salary of 0.');
  } catch (error) {
    console.error('Error updating users:', error);
  }
}

updateExistingUsers();
