/* ******************************************************************************
 * Signing Secret Varification
 *
 * Signing secrets replace the old verification tokens.
 * Slack sends an additional X-Slack-Signature HTTP header on each HTTP request.
 * The X-Slack-Signature is just the hash of the raw request payload
 * (HMAC SHA256, to be precise), keyed by your app’s Signing Secret.
 *
 * More info: https://api.slack.com/docs/verifying-requests-from-slack
 *
 * Tomomi Imura (@girlie_mac)
 * ******************************************************************************/

const crypto = require("crypto");
const timingSafeCompare = require("tsscmp");
const logs = require('./debug-console');

const isVerified = req => {
  var verified = false;
  const signature = req.headers["x-slack-signature"];
  const timestamp = req.headers["x-slack-request-timestamp"];
  const hmac = crypto.createHmac("sha256", process.env.SECRET_SLACK_SIGNING_ID);
  const [version, hash] = signature.split("=");

  // Check if the timestamp is too old
  const fiveMinutesAgo = ~~(Date.now() / 1000) - 60 * 5;
  
  if (timestamp > fiveMinutesAgo) { // If the timestamp value is greater than now minus 5 minutes, evaluate this:
    hmac.update(`${version}:${timestamp}:${req.rawBody}`);
    verified = timingSafeCompare(hmac.digest("hex"), hash);
  }
  // check that the request signature matches expected value
  return verified
};

const validate = (req,res) => {
  var valid = isVerified(req);
  if (valid) { // not verified
    logs.request(req,"REQUEST (AXIOS - validate)");
    res.set('body',{payload: JSON.stringify({text:"Response received and verified from Slack!"})});
    res.status(200).type('application/x-www-form-urlencoded').send(); // Send empty message ("OK status")
    logs.result(res,"RESPONSE (AXIOS - validate)");
  } else { // verified
    res.status(404).end(); // Send "not found" status immediately
  }
  return valid;
}

module.exports = { isVerified, validate };
