// JavaScript source code
var fs = require('fs'), Player = require('./player.js')

var path = "player_database.json"

module.exports = class io {
    constructor() { io.players_list = new Array(); }


    read_players() {
        fs.readFile(path, function (err, buffer) {
            if (err) { console.log(err); throw err; }
            else {
                var json_data_string = buffer.toString();
                var json_data = JSON.parse(json_data_string)
                for (var i in json_data.players) {
                    console.log(json_data.players[i])
                    let player = new Player(json_data.players[i].name, json_data.players[i].role, json_data.players[i].color, json_data.players[i].lv,
                        json_data.players[i].exp, json_data.players[i].expLv, json_data.players[i].stats, json_data.players[i].inventory, json_data.players[i].credits)
                    io.players_list.push(player);
                }
                //console.log(buffer.toString());
                console.log('players list length: ' + io.players_list.length);
            }
        });
    }

    static is_in_data(_name){
        var is_name = false
        for (var i in io.players_list) {
            if (_name == io.players_list[i].name) {
                is_name = true
                break;
            }
        }
        return is_name;
    }

    static check_for_new_members(testbot) {
        var has_new_player = false
        var member_list = testbot.guilds.get('598238794122264597')
        member_list.members.forEach(_name => {
            console.log(_name.user.tag)
            if (!this.is_in_data(_name)) {
                let player = new Player(_name, _name.roles, 0, 0, 0, 50, "", "", 1000)
                io.players_list.push(player)
                has_new_player = true
            }
        })
        if (has_new_player) {
            io.store_players()
            console.log('players list length: ' + io.players_list.length);
        }
    }

    static store_players() {
        fs.writeFile(path, this.convert_to_json(), 'utf8', (err) => { if (err) console.log(err); console.log('Writen to file.') });
    }
    static convert_to_json() {
        var iter = 0
        var json_data = '{ \n    "players": [\n'
        for (var i in io.players_list) {
            if (iter < io.players_list.length - 1) {
                //console.log(play.name + play.role + play.level + play.exp + play.inventory + play.credits);
                json_data += '            {\n'
                json_data += '            "name":' + '"' + io.players_list[i].name + '",' + "\n"
                json_data += '            "role":' + '"' + io.players_list[i].role + '",' + "\n"
                json_data += '            "color":' + '' + io.players_list[i].color + ',' + "\n"
                json_data += '            "lv":' + '' + io.players_list[i].level + ',' + "\n"
                json_data += '            "exp":' + '' + io.players_list[i].exp + ',' + "\n"
                json_data += '            "expLv":' + '' + io.players_list[i].expLv + ',' + "\n"
                json_data += '            "stats":' + '"' + io.players_list[i].stats + '",' + "\n"
                json_data += '            "inventory":' + '"' + io.players_list[i].inventory + '",' + "\n"
                json_data += '            "credits":' + '' + io.players_list[i].credits + '' + "\n            },\n"
            }
            else {
                //console.log(play.name + play.role + play.level + play.exp + play.inventory + play.credits);
                json_data += '            {\n'
                json_data += '            "name":' + '"' + io.players_list[i].name + '",' + "\n"
                json_data += '            "role":' + '"' + io.players_list[i].role + '",' + "\n"
                json_data += '            "color":' + '' + io.players_list[i].color + ',' + "\n"
                json_data += '            "lv":' + '' + io.players_list[i].level + ',' + "\n"
                json_data += '            "exp":' + '' + io.players_list[i].exp + ',' + "\n"
                json_data += '            "expLv":' + '' + io.players_list[i].expLv + ',' + "\n"
                json_data += '            "stats":' + '"' + io.players_list[i].stats + '",' + "\n"
                json_data += '            "inventory":' + '"' + io.players_list[i].inventory + '",' + "\n"
                json_data += '            "credits":' + '' + io.players_list[i].credits + '' + "\n            }\n"
            }
            iter++;
        }
        json_data += "        ]\n}"
        return json_data
    }

    hasPlayerInPlayerList(name) {
        var bool = false;
        if (io.players_list.length != 0) {
            for (var i in io.players_list) {
                console.log(io.players_list[i].name + " : " + name)
                if (io.players_list[i].name == name) { bool = true; break; }
            }
            console.log(bool)
        }
        return bool
    }

    find_player(name) {
        var pl_to_look_up
        if (io.players_list.length != 0) {
            for (var i in io.players_list) {
                console.log(io.players_list[i].name + " : " + name)
                if (io.players_list[i].name == name) { pl_to_look_up = io.players_list[i]; break; }
            }
            return pl_to_look_up
        }
    }

    get_player_index(name) {
        if (io.players_list.length != 0) {
            for (var i in io.players_list) {
                console.log(io.players_list[i].name + " : " + name)
                if (io.players_list[i].name == name) { return i; break; }
            }
        }
    }

    get_players_list() {
        if (fs.existsSync(path)) {
            this.read_players()
            return io.players_list
        }
        else { return io.players_list }
    }

    static check_for_lv_up(player, channel) {
        if (player.exp >= player.expLv) {
            player.exp = player.exp - player.expLv
            player.expLv = player.expLv * 2
            player.level = player.level + 1
            channel.send(player.name + ' you have leveled up to lv : ' + player.level)
            this.check_for_lv_up(player, channel)
        }
    }

}
