const sendRedirect = require("./sendRedirect");

const login = [
  (req, res) => {
    return res.redirect(
      301,
      "https://2e1a8eed76dd22adb05b403958634573.auth.us-west-1.amazoncognito.com/login?response_type=code&client_id=lmres6t4lqjdc1tre55t7qte0&redirect_uri=https://d3t14pxg52jdxt.cloudfront.net/prod/get-cookies"
    );
  },
];
module.exports = login;
