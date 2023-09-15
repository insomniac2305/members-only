const addCurrentUser = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

const addSessionMessages = (req, res, next) => {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = msgs.length > 0;
  req.session.messages = [];
  next();
};

module.exports = { addSessionMessages, addCurrentUser };
