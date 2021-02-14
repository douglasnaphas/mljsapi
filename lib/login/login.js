const sendRedirect = require("./sendRedirect");

const login = [
  (req, res) => {
    return res.redirect(301, "https://example.com");
  },
];
module.exports = login;
