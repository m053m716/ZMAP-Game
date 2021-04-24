function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

module.exports = class MessageBlock {
  constructor(app) {
      this.app = app;
      this.token = process.env.SLACK_BOT_TOKEN;
      this.has_block = false
      this.cfg = {
        'Content-Type': 'application/json'
    }
    this.user = {
      id: null, 
      username: null, 
      name: null
    };
    this.url = {
      jitsi: {
        fixed: "https://meet.jit.si/",
        variable: String(process.env.JITSI_ROOM_DEFAULT)
      },
      schmeppy: {
        fixed: "https://shmeppy.com/game/", 
        variable: String(process.env.SCHMEPPY_GAME_DEFAULT)
      }
    }
    this.votes = [0, 0, 0];
    this.setting = process.env.CAMPAIGN_SETTING
    this.ts = null; // identifies the previous post
    this.messages = []; // identifies any other messages issued by this bot
    // this.id = data_structure.Tracking.current.id;
    // this.channel = process.env.BOT_VOTING_CHANNEL_ID;
    this.channel = null
  }
  bot_username() {
    if (this.id.public === null) {
      return this.setting + " Campaign"
    } else {
      console.log("Public ID: " + this.id.public);
      return this.setting + " (Session-" + this.id.public.toString() + ")"
    }
  }
  end_session() {
    this.delete_all_notification_messages();
    this.delete_existing_message();
    this.ts = null
    this.has_block = false
    this.id.public = this.id.public + 1;
    this.id.private = randomString(8, '0123456789abcdef');
  }
  delete_all_notification_messages() {
    this.messages.forEach(ts => this.delete_existing_message(ts));
    this.messages = [];    
  }
  delete_existing_message(ts = null) {
    if (ts === null) {
      ts = this.ts;
    }
    let delete_args = {
      token: this.token,
      channel: this.channel,
      ts: ts
    };
    return this.app.axios.post("chat.delete", delete_args, this.cfg)
      .catch(e => logs.def_error(e, "Invalid delete"));
  }
  full_url(target) {
    return "" + this.url[target].fixed + this.url[target].variable 
  }
  send_block() {
    let delete_args = {
      token: this.token,
      channel: this.channel,
      ts: this.ts
    };
    let msg_args = {
      token: this.token,
      channel: this.channel,
      text: "", 
      blocks: this.blocks(), 
      icon_emoji: ":stanford:", 
      username: this.bot_username()
    };
    this.app.axios.post("chat.delete", delete_args, this.cfg)
      .catch(e => logs.def_error(e, "Invalid delete"));
    this.app.axios.post("chat.postMessage", msg_args, this.cfg)
      .then(p => 
      {
        logs.resolved(p);
        this.ts = p.data.ts;  
      })
      .catch(e => {logs.def_error(e)});
  }
  
  send_message(text) {
    let msg_args = {
      token: this.token,
      channel: this.channel,
      text: text,  
      icon_emoji: ":stanford:", 
      username: this.bot_username()
    };
    this.app.axios.post("chat.postMessage", msg_args, this.cfg)
      .then(p => 
      {
        logs.resolved(p);
        this.messages.push(p.data.ts);  
      })
      .catch(e => {logs.def_error(e)});
  }
  start_session(user, channel_id, session_id) {
    this.vote_reset_callback();
    this.user = user;
    this.channel = channel_id;
    if (session_id !== '') {
      console.log("Updating session_id: " + session_id);
      this.id.public = Number(session_id);
      this.id.private =  randomString(8, '0123456789abcdef');
    }
    let msg_args = {
      token: this.token,
      channel: this.channel,
      text: "", 
      blocks: this.blocks(), 
      icon_emoji: ":stanford:", 
      username: this.bot_username()
    };
    my.axios.post("chat.postMessage", msg_args, this.cfg)
      .then(p => 
      {
        logs.resolved(p);
        this.ts = p.data.ts;  
      })
      .catch(e => {logs.def_error(e)});
    this.has_block = true;
  }
  vote_incrementer_callback(value) {
    const index = parseInt(value,10);
    this.votes[index] = this.votes[index] + 1;
    this.send_block();
  }
  vote_reset_callback() {
    this.votes = [0, 0, 0];
    this.send_block();
  }
  blocks() {
    const arr = [
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":film_projector: Open Video Chat",
              emoji: true
            },
            value: "jitsi",
            url: this.full_url("jitsi"),
            action_id: "button-action-jitsi"
          }, 
          {
            type: "button",
              text: {
                type: "plain_text",
                text: ":doge_fingerguns: Open Schmeppy",
                emoji: true
              },
              value: "schmeppy",
              url: this.full_url("schmeppy"),
              action_id: "button-action-schmeppy"
          },
          {
            type: "button",
              text: {
                type: "plain_text",
                text: ":x: End Session",
                emoji: true
              },
              value: "End",
              action_id: "button-action-end"
          }
        ]
      },
      {
        type: "divider"
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            emoji: true,
            text: `Votes: ${this.votes[0]}`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":game_die: Joining now!"
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "Vote"
          },
          value: "0",
          action_id: "vote"
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            emoji: true,
            text: `Votes: ${this.votes[1]}`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":watch: I'm running a few minutes late :smiling_face_with_tear:"
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "Vote"
          },
          value: "1",
          action_id: "vote"
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            emoji: true,
            text: `Votes: ${this.votes[2]}`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":reversed_hand_with_middle_finger_extended: No!"
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "Vote"
          },
          value: "2",
          action_id: "vote"
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":dragon: :crossed_swords: :game_die: :dragon: :crossed_swords: :game_die: :crossed_swords: :dragon: :game_die: :crossed_swords: :dragon: "
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "_(Requested by <https://zmap-workspace.slack.com/team/" + this.user.id + "|" + this.user.name + ">)_"
          }
        ]
      }
    ];
    return arr.slice(); // Return copy
  }
};
