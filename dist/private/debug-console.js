const qs = require("qs");

// Set debug status
const enable = (process.env.CONSOLE_DEBUG_ON === 'true');
console.log('logs enabled? ', enable);

const curTime_ = (locale, options) => {
  const ct = new Date(Date.now());
  return ct.toLocaleString(locale, options);
};

const slackTime_ = (ts, locale='en-US', options={timeZone: 'CST'}) => {
  const st = ts ? new Date(ts*1000) : new Date(Date.now());
  return st.toLocaleString(locale,options);
}

function printHeader_(note, ts) {
  console.group();
  console.log("---", note, "---       Time:(", ts, ")");
  console.group();
}

// Utilities for console debugging
const action = (ts, type, trigger_id, user, actions) => {
  if (enable) {
    printHeader_("Action Detected", slackTime_(ts));
    console.log("------------------------------");
    console.log("trigger_id: ", trigger_id);
    console.log("user: ", user);
    console.log("actions: ", actions);
    console.log("type: ", type);
    console.log("------------------------------");
    console.groupEnd();
    console.groupEnd();
  }
};

// Handles axios "caught" errors
const caught_error = (
  err,
  note = "",
  locale = "en-US",
  options = { timeZone: "CST" }
) => {
  if (enable) {
    try {
      let ts = curTime_(locale, options);
      printHeader_(note, ts);
      console.log("------------------------------");
      if (err.response) {
        console.log("**RESPONSE**");
        console.log(err.response.data);
        console.log(err.response.status);
        console.warn(err.response.headers);
      } else if (err.request) {
        console.log("**REQUEST**");
        console.warn(err.request);
      } else {
        console.log("**MESSAGE**");
        console.warn("Error: ", err.message);
      }
      console.trace();
      console.log("------------------------------");
      console.groupEnd();
      console.groupEnd(); 
    } catch (e) {
      console.log("------------------------------");
      console.warn("unexpected input to `logs.caught_error` (console error): ", e);
      console.log("------------------------------");
    }
  }
};

// Handles "default" error reporting
const def_error = (
  err,
  note = "",
  locale = "en-US",
  options = { timeZone: "CST" }
) => {
  if (enable) {
    let ts = curTime_(locale, options);
    printHeader_(note, ts);
    console.log("------------------------------");
    console.warn(err);
    console.log("------------------------------");
    console.groupEnd();
    console.groupEnd();
  }
};

const event = (
  ts,
  type,
  user = "dev",
  channel = "(#general)",
  other = null
) => {
  if (enable) {
    printHeader_("Event Detected", slackTime_(ts));
    console.log("------------------------------");
    console.log("type: ", type);
    console.log("user: ", user);
    console.log("channel: ", channel);
    console.log("other info: ", other);
    console.log("------------------------------");
    console.groupEnd();
    console.groupEnd();
  }
};

// Prints axios request
const request = (
  req,
  note = "REQUEST (AXIOS)",
  locale = "en-US",
  options = { timeZone: "CST" }
) => {
  if (enable) {
    try {
      let ts = curTime_(locale, options);
      printHeader_(note, ts);
      console.log("req.hostname ", req.hostname);
      console.log("req.path ", req.path);
      console.log("accepts application/json? ", req.accepts("application/json"));
      console.log("fresh? ", req.fresh);
      console.log("------------------------------");
      // console.log("req.body: ", req.body);
      // console.log("req.rawHeaders: ", req.rawHeaders);
      console.log("qs.parse(req.rawHeaders): ", qs.parse(req.rawHeaders));
      console.log("qs.parse(req.body.payload): ", qs.parse(req.body.payload));
      console.log("req.params: ", req.params);
      console.log("req.query: ", req.query);
      console.log("------------------------------"); 
    } catch (e) {
      console.log("------------------------------");
      console.warn("unexpected input to `logs.request` (console error): ", e);
      // console.log("request: ", req);
      console.log("------------------------------");
    }
    console.groupEnd();
    console.groupEnd();
  }

};

// Handles resolved promises
const resolved = (
  p,
  note = "PROMISE",
  locale = "en-US",
  options = { timeZone: "CST" }
) => {
  if (enable) {
    try {
      let ts = curTime_(locale, options);
      printHeader_(note, ts);
      console.log("------------------------------");
      console.log("status: ", p.status);
      console.log("data: ", p.data);
      console.log("------------------------------");
    } catch (e) {
      console.log("------------------------------");
      console.warn("unexpected input to `logs.promise` (console error): ", e);
      console.log("response: ", p);
      console.log("------------------------------");
    }
    console.groupEnd();
    console.groupEnd();
  }
};

// Handles axios successful response data
const response = (
  res,
  note = "",
  locale = "en-US",
  options = { timeZone: "CST" }
) => {
  if (enable) {
    try {
      let ts = curTime_(locale, options);
      printHeader_(note, ts);
      console.log(
        "headers.date (",
        typeof res.headers["date"],
        "): ",
        res.headers["date"]
      );
      console.log(
        "headers.content-type (",
        typeof res.headers["content-type"],
        "): ",
        res.headers["content-type"]
      );
      console.log("------------------------------");
      console.log("status: ", res.status);
      console.log("statusText: ", res.statusText);
      console.log("headers: ", res.headers);
      console.log("config: ", res.config);
      console.log("config.transformRequest[0]: ", res.config.transformRequest[0]);
      console.log("config.transformResponse[0]: ", res.config.transformResponse[0]);
      console.log("data (", typeof res.data, "): ", res.data);
      console.log("------------------------------");
    } catch (e) {
      console.log("------------------------------");
      console.warn("unexpected input to `logs.response` (console error): ", e);
      console.log("response: ", res);
      console.log("------------------------------");
    }
    console.groupEnd();
    console.groupEnd();
  }
};

// Handles general successful result object
const result = (
  res,
  note = "RESPONSE (AXIOS)",
  locale = "en-US",
  options = { timeZone: "CST" }
) => {
  if (enable) {
    let ts = curTime_(locale, options);
    printHeader_(note, ts);
    try {
      console.log("headers sent? ", res.headersSent);
      console.log("content-type: ", res.get("Content-Type"));
      console.log("------------------------------");
      console.log("res.locals: ", res.locals);
      // console.log("res.get(body).payload: ", JSON.stringify(res.get('body')));
      console.log("------------------------------");
    } catch (e) {
      console.log("------------------------------");
      console.warn("unexpected input to `logs.result` (console error): ", e);
      console.log("result: ", res);
      console.log("------------------------------");
    }
    console.groupEnd();
    console.groupEnd();
  }
};

module.exports = {
  action,
  caught_error,
  def_error,
  enable,
  event,
  request,
  resolved,
  response,
  result
};
