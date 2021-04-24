module.exports = class DiceRoller {
      constructor(app) {
        this.app = app;
        this.last = {
          rolls: [],
          sum: 0
        };
        this.current = {
          rolls: [],
          sum: 0
        };
      }
    parse(text, user) {
        var output = {
            rolls: [],
            sum: 0
        };
        text = text.replace(/ /g, "");
        let all_values = text.split("+");
        all_values.forEach(e => {
            let cleaned = e.split("d");
            let n_dice = parseInt(cleaned[0], 10);
            let n_sides = parseInt(cleaned[1], 10);
            let result = this.roll(n_dice, n_sides);
            let datum = { dice: "d" + String(n_sides), result: result.rolls };
            output.rolls.push(datum);
            output.sum += result.sum;
        });
        this.update(output);
            // return self.blocks(output, user)
            return JSON.stringify(output, null, 2);
        }
    roll(n_dice, n_sides) {
        var total = 0;
        var rolls = [];
        for (var i = 0; i < n_dice; i++) {
            let value = this.random_value(n_sides);
            rolls.push(value);
            total += value;
        }
        return {
            rolls: rolls,
            sum: total
        };
    }
    random_value(n_sides) {
        return Math.floor(Math.random() * n_sides) + 1;
    }
    update(roll) {
        this.last = this.current;
        this.current = roll;
    }
    blocks(output, user) {
        const arr = [{
            blocks: [
            {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `{user} is rolling :game_die: ...`
              }
            ]
            },
            {
            type: "context",
            elements: [
              {
                type: "image",
                image_url:
                  "https://images-na.ssl-images-amazon.com/images/I/61jjNdNQ-DL._AC_SL1000_.jpg",
                alt_text: "/roll"
              }
            ]
            }
            ]
            }
        ];
        output.rolls.forEach(result => {
            arr[0].blocks[1].elements.append({
                type: "mrkdwn",
                text: "*Cat* has approved this message."
            });
        return arr.slice(); // Return copy
        });
    }
};
