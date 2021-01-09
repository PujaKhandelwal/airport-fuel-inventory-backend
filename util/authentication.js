const { User } = require("../model/user");

async function authentication(_id, email) {
  let userId = await User.findById(_id);
  console.log(userId);
  let userEmail = await User.findOne({ email: email });
  console.log(userEmail);

  if (userId && userEmail) return true;
  else return false;
}

module.exports.authentication = authentication;