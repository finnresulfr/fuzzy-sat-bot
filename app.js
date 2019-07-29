require('dotenv').config()

const BotBrain = require('./chatbot_brain.js'), Discord = require('discord.js'), testbot = new Discord.Client(),
    Player = require('./player.js'), game_corner = require('./game_corner.js'), io = require('./io.js'), image_builder = require('./image_builder.js'),
    string_builder = require('./string_builder.js')
const reg_quoat = 'you will need to register first. Please use the $reg command to register. Then we can have your teleporter pass made and you can join the expodition.'

var IO = new io()
var fs = require('fs');
var nameIter = 0
var game_name_list = new Array();
var players_list
var chatbot_name
var botBrain = new BotBrain()
var checking = false

//Null block placeholder
function gamestart(names) { }

//Ends the game and resets values
function endgame() {
    game_name_list = new Array();
    nameIter = 0
}

//Checks to see if name is in the list
function hasNameInParty(names, name) {
    if (names.includes(name)) { return true; }
    else { return false; }
}


//Checks to see if channel is in the list.
function isCorrectChannel(channel) {
    var channels = [testbot.channels.get('600344665031573504'), testbot.channels.get('600305114128973845')];
    if (channels.includes(channel)) { return true; }
    else { return false; }
}

//Starts the bot
testbot.on('ready', () => {
    console.log("Connected as " + testbot.user.tag)
    chatbot_name = testbot.user.toString()
    if (players_list == null) {
        players_list = IO.get_players_list()
    }
})

function next_words_string_builder(strings, firstword) {
    var constructed_string = ""
    var iterator = 0
    for (i in strings) {
        if (strings[i] != firstword && strings.length -1 > iterator) {
            constructed_string += strings[i] + " "
        }
        else if (strings.length - 1 == iterator) {
            constructed_string += strings[i]
        }
        iterator++
    }
    console.log(constructed_string)
    return constructed_string
}

function talk_bot(msg, split_message, firstword) {
   //Todo implement talk to bot function.
}

//Listener for messages
testbot.on('message', msg => {
    if (isCorrectChannel(msg.channel)) {
        string_builder.check_bad_words(msg)
        var split_message = msg.content.split(' ')
        var firstword = split_message[0]

        //switch methods are great if you have a lot of if statements
        switch (firstword.toLowerCase()) {

            case chatbot_name:
                botBrain.respond(next_words_string_builder(split_message, firstword), msg).catch((e) => { console.log(e) })
                break;
            case '$stop_check':
            msg.delete()
                checking = false
                break;
            case '$start_check':
            msg.delete()
            checking = true
            var interval = setInterval(function () {
                if (players_list.length > 0 && checking) {
                    io.check_for_new_members(testbot)
                    console.log('checking for members...');
                }
            }, 30000);
                break;


            //Outcommented for debugging.
            /*case '$Hey':
            case '$hey':
                msg.reply("Hello, how are you today?")
                break;
                case '$start_load':
                string_builder.build_loading(msg.channel)
                break;*/
            case '$debug':
                var message = "Currently registered players.\n"
                for (var i in players_list) {
                    message += players_list[i].name + "\n"
                }
                msg.reply(message)
                break;

            case '?help':
                var message = "Here are the commands you can issue at the moment.\n$stats, $reg, $join, $end, $game, $card, $cardview"
                msg.reply(message)
                break;
            case '$cardview':
            var oricolor = io.players_list[IO.get_player_index(msg.author)].color
            var _player = IO.find_player(msg.author)
            var auth = msg.author
            if (_player != null) {
                msg.channel.send('Preview a new card by entering a number between 0 - 4(You can set it with $card)')
                    .then(() => {
                        msg.channel.awaitMessages(res => res.author == auth && res.content >= 0 && res.content <= 4, {
                            max: 1,
                            time: 30000,
                            error: ['time']
                        })
                            .then((collected) => {
                                image_builder.preview_cards(auth, IO.get_player_index(auth), collected.first().content, msg.channel)
                            })
                        })
                    }
                break;
            case '$card':
            if (split_message.length > 1 && IO.hasPlayerInPlayerList(split_message[1])) {
                var index = IO.get_player_index(split_message[1])
                var oricolor = io.players_list[index].color
                var _player = IO.find_player(split_message[1])
                var auth = msg.channel.members.get(split_message[1].slice(2, split_message[1].length - 1)).user
                console.log(split_message[1].slice(2, split_message[1].length - 1));
                if (_player != null) {
                    card_builder.get_player_card(auth, index, msg.channel)
                }
                else { msg.reply("I could not find your stats. Have you registered with '$reg'?") }
            }
            else {
                var oricolor = io.players_list[IO.get_player_index(msg.author)].color
                var _player = IO.find_player(msg.author)
                var auth = msg.author
                if (_player != null) {
                    msg.channel.send('Change your card by entering a number between 0 - 4(You can view cards with $cardview)')
                        .then(() => {
                            msg.channel.awaitMessages(res => res.author == auth && res.content >= 0 && res.content <= 4, {
                                max: 1,
                                time: 30000,
                                error: ['time']
                            })
                                .then((collected) => {
                                    io.players_list[IO.get_player_index(auth)].color = collected.first().content
                                })
                                .then(() => {
                                    msg.channel.send('This action will cost 500 credits. Would you like to apply the new color? ( y | n )')
                                        .then(() => {
                                            msg.channel.awaitMessages(res => res.author == auth && res.content.toLowerCase() == 'y' || res.author == auth && res.content.toLowerCase() == 'n', {
                                                max: 1,
                                                time: 30000,
                                                error: ['time']
                                            })
                                                .then((collected) => {
                                                    if (collected.first().content.toLowerCase() == 'y' && io.players_list[IO.get_player_index(auth)].credits >= 500) {
                                                        io.players_list[IO.get_player_index(auth)].credits -= 500
                                                        io.store_players()
                                                        image_builder.get_player_card(auth, IO.get_player_index(auth), msg.channel)
                                                    }
                                                    else if (collected.first().content.toLowerCase() == 'n' || io.players_list[IO.get_player_index(auth)].credits < 500) {
                                                        io.players_list[IO.get_player_index(auth)].color = oricolor
                                                        msg.channel.send('No changes applied...')
                                                    }
                                                })
                                                .catch(err => { console.error(err); io.players_list[IO.get_player_index(auth)].color = oricolor })

                                        })
                                        .catch(err => { console.error(err); io.players_list[IO.get_player_index(auth)].color = oricolor })
                                })
                        })
                }
                else { msg.reply("I could not find your stats. Have you registered with '$reg'?") }
            }
                break;
            case '$stats':
                var _play = IO.find_player(msg.author)
                if (_play != null) {
                    image_builder.get_player_card(msg.author, IO.get_player_index(msg.author), msg.channel)
                }
                else { msg.reply("I could not find your stats. Have you registered with '$reg'?") }
                break;
            case '$reg':
                if (IO.hasPlayerInPlayerList(msg.author)) {
                    msg.reply("you've already registered.")
                    break;
                }
                else {
                    let new_player = new Player(msg.author, msg.member.roles, 0, 0, 0, 50, "", "", 1000)
                    io.players_list.push(new_player)
                    io.store_players()
                    msg.reply("you're now registered and your teleporter pass has been made. Here is 1000 credits to get you started.")
                    break;
                }
            case '$join':
                if (IO.hasPlayerInPlayerList(msg.author) && players_list.length != 0) {
                    if (nameIter < 3 && !hasNameInParty(game_name_list, msg.author)) {
                        msg.reply("Has joined the expodition!")
                        game_name_list[nameIter] = msg.author;
                        nameIter++;
                        msg.channel.send("There is " + nameIter + "/4 in the party.")
                    }
                    else if (nameIter > 3) { msg.channel.send("The party is full.") }
                    else if (hasNameInParty(game_name_list, msg.author)) { msg.reply("You are already in the party.") }
                }
                else if (!IO.hasPlayerInPlayerList(msg.author)) {
                    msg.reply(reg_quoat)
                }
                break;
            case '$end':
                msg.reply("has cancelled the expodition...")
                endgame()
                break;
            case '$game':
                if (IO.hasPlayerInPlayerList(msg.author)) {
                    let game = new game_corner()
                    game.game_corner(testbot, next_words_string_builder(split_message, firstword), msg, IO.get_player_index(msg.author))
                }
                else { msg.reply(reg_quoat) }
                break;
            case '$test':
                var named = msg.author
                card_builder.get_player_card(msg.author, IO.get_player_index(msg.author), msg.channel)
                msg.channel.send('What tag would you like to see? This message will be cancelled within 30 seconds.')
                    .then(() => {
                        msg.channel.awaitMessages(response => response.author === named, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                        .then((collected) => {
                            msg.channel.send('The collected message was: ' + collected.first().content)
                        })
                            .catch(() => {
                                msg.channel.send('There was no collected message in the elapsed time-frame.')
                            })
                    })
                break;
        }
    }
})

testbot.on('error', (err) => { console.log(err) })

//Logs bot onto discord
testbot.login(process.env.BOT_TOKEN);
