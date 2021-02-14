const sendRedirect = require("./sendRedirect");

const login = [
  (req, res) => {
    return res.redirect(301, process.env.IDP_URL);
  },
];
module.exports = login;
