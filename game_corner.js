// JavaScript source code
//Doesn't function properly... :-(
const game_types = ['coin flip', 'cf', 'twenty one', '21', 'tic tac toe', 'ttt']
const questions = ['How much would you like to bet? (enter just a number)', 'Heads or tails? (heads = 0, tails = 1)']
const io = require("./io.js")
const image_builder = require('./image_builder.js')
const err_time = 'There was no input within 30 seconds or you tried to input the wrong value.', coin_sides = ['Heads', 'Tails']
const game_states = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05];
const cards = ['[A]', '[2]', '[3]', '[4]', '[5]', '[6]', '[7]', '[8]', '[9]', '[10]', '[J]', '[Q]', '[K]', '[]'];
const players_index_list = ['x', 'o']
var players = ['', '']
var current_player = 0
const ttt_game_states = [0x06, 0x07, 0x08, 0x09, 0x0A]
var msg
var user
var channel
var bot
var player_index
var amount = 0
var game_state = game_states[0]
var is_ai_active = false
var dealers_cards = []; players_cards = []
var ttt_board = [
    ['.', '.', '.'],
    ['.', '.', '.'],
    ['.', '.', '.']
]
var avalible = 9

module.exports = class game_corner {
    game_corner(bot, game_type, msg, player_index) {
        this.msg = msg; this.user = msg.author; this.channel = msg.channel; this.bot = bot; this.player_index = player_index
        switch (game_type) {
            case game_types[0]:
            case game_types[1]:
                console.log('game_corner: coin flip has started. player : ' + io.players_list[player_index].credits)
                this.channel.send('Coin flip has started.')
                this.coin_flip()
                break;
            case game_types[2]:
            case game_types[3]:
                console.log('game_corner: twenty one has started. player : ' + io.players_list[player_index].credits)
                this.channel.send('Twenty one has started.')
                this.twenty_one().catch((err) => { console.log(err) })
                break;
                case game_types[4]:
                case game_types[5]:
                    console.log('game_corner: tic tac tow has started. player : ' + io.players_list[this.player_index]);
                    game_state = ttt_game_states[0]
                    this.tic_tac_toe().catch((err) => { console.log(err); });
                    break;
            default:
                this.channel.send('You can chose a game type by typing (coin flip, cf | twenty one, 21 | tic tac toe, ttt) after $game.')
                if (io.players_list[this.player_index].credits == 0) {
                    amount = 50
                    this.channel.send("Oof you are broke as dirt... here's 50 credits you bum.")
                    this.save()
                }
                break;
        }
    }

    async tic_tac_toe() {

        switch (game_state) {

            case ttt_game_states[0]:
                players[0] = this.user
                this.channel.send('A new board has been made.')
                this.channel.send(players[0] + ' is player one. Anyone can join by typing join, or you can play with an AI by typing ai.')
                .then(() => {
                    this.channel.awaitMessages(res => res.content.toLowerCase() == 'join' || res.author == players[0] && res.content.toLowerCase() == 'ai', {
                        max: 1,
                        time: 300000,
                        errors:['time']
                    })
                    .then((collected) => {
                        var one_or_two = collected.first().content
                        if (one_or_two.toLowerCase() == 'join') {
                            players[1] = collected.first().author
                            this.channel.send(players[1] + ' is player two. The match has begun.')
                            game_state = ttt_game_states[1]
                            this.tic_tac_toe().catch((err) => { console.log(err); });
                        }
                        else {
                            is_ai_active = true
                            game_state = ttt_game_states[1]
                            this.tic_tac_toe().catch((err) => { console.log(err); });
                        }
                    })
                    .catch((err) => { console.log(err); })
                })
                break;

            case ttt_game_states[1]:
                if (is_ai_active) {
                    this.channel.send('AI is currently being worked on. Sorry for the inconvenience.')
                }
                else {
                    this.channel.send(players[current_player] + "'s turn. (A1-3 | B1-3 | C3-3)")
                    .then(() => {
                        this.channel.awaitMessages(res => res.author == players[current_player] && this.is_a1_c3(res.content), {
                            max: 1,
                            time: 300000,
                            error: ['time']
                        })
                        .then((collected) => {
                            //make a1-c3 dycrypter
                            var string = collected.first().content
                            this.ttt_place(string)
                        })
                        .catch(err => {
                            this.channel.send('The current game has timed out.')
                        })
                    })
                }
                break;

            case ttt_game_states[2]:
                break;

            case ttt_game_states[3]:
                break;

            case ttt_game_states[4]:
                break;

        }
    }

    async twenty_one() {

        switch (game_state) {

            case game_states[0]:
                this.channel.send(questions[0])
                    .then(() => {
                        this.channel.awaitMessages(res => res.author == this.user && parseInt(res.content) > 0 && parseInt(res.content) <= io.players_list[this.player_index].credits, {
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        })
                            .then((collected) => {
                                amount = parseInt(collected.first().content)
                                console.log(collected.first().content + ' : ' + parseInt(collected.first().content))
                                this.channel.send(this.user + ' will lay ' + amount + ' credits on the line')
                                this.dealing(dealers_cards, players_cards)
                                if (!this.check_for_bust(players_cards)) {
                                    game_state = game_states[1]
                                    this.twenty_one().catch((err) => { console.log(err) })
                                }
                                else {
                                    game_state = game_states[2]
                                    this.twenty_one().catch((err) => { console.log(err) })
                                }
                            })
                            .catch((err) => {
                                this.channel.send(err_time)
                                console.log(err)
                            })
                    })

                break;

            case game_states[1]:
                var string = 'Dealers cards :\n'
                string = string + this.add_hidden_cards_to_string(dealers_cards)
                string = string + this.add_player_cards_to_string(players_cards)
                console.log(string)
                this.channel.send(string + '\nWhat will you do? ( hit | fold | bet )')
                    .then(() => {
                        this.channel.awaitMessages(res => res.author == this.user && res.content.toLowerCase() == 'hit' || res.content.toLowerCase() == 'fold'
                            || res.content.toLowerCase() == 'bet', {
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        })
                            .then((collected) => {
                                if (collected.first().content.toLowerCase() == 'hit') {
                                    this.draw_card(players_cards)
                                    if (!this.check_for_bust(players_cards)) {
                                        game_state = game_states[1]
                                        this.twenty_one().catch((err) => { console.log(err) })
                                    }
                                    else {
                                        game_state = game_states[2]
                                        this.twenty_one().catch((err) => { console.log(err) })
                                    }
                                }
                                else if (collected.first().content.toLowerCase() == 'fold') {
                                    if (this.is_win(dealers_cards, players_cards)) {
                                        game_state = game_states[3]
                                        this.twenty_one().catch((err) => { console.log(err) })
                                    }
                                    else {
                                        game_state = game_states[4]
                                        this.twenty_one().catch((err) => { console.log(err) })
                                    }
                                }
                                else if (collected.first().content.toLowerCase() == 'bet') {
                                    game_state = game_states[5]
                                    this.twenty_one().catch((err) => { console.log(err) })
                                }
                            })
                            .catch((err) => {
                                this.channel.send(err_time)
                                console.log(err)
                            })
                    })

                break;

            case game_states[2]:
                var string = 'You bust with:\n' + this.add_dealers_cards_to_string(dealers_cards) + this.add_player_cards_to_string(players_cards) + '\nYou lose ' + -amount + ' credits.'
                this.channel.send(string)
                this.save()
                this.clear_everything()
                break;

            case game_states[3]:
                var string = 'You won with:\n' + this.add_dealers_cards_to_string(dealers_cards) + this.add_player_cards_to_string(players_cards) + '\nYou poket ' + amount + ' credits and gain 50 exp'
                this.channel.send(string)
                io.players_list[this.player_index].exp += 50
                io.check_for_lv_up(io.players_list[this.player_index], this.channel)
                this.save()
                this.clear_everything()
                break;

            case game_states[4]:
                var string = 'You lost with:\n' + this.add_dealers_cards_to_string(dealers_cards) + this.add_player_cards_to_string(players_cards) + '\nYou lose ' + -amount + ' credits.'
                this.channel.send(string)
                this.save()
                this.clear_everything()
                break;

            case game_states[5]:
                this.channel.send(questions[0])
                    .then(() => {
                        this.channel.awaitMessages(res => res.author == this.user && parseInt(res.content) > 0 && parseInt(res.content) <= io.players_list[this.player_index].credits - amount, {
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        })
                            .then((collected) => {
                                amount = amount + parseInt(collected.first().content)
                                console.log(collected.first().content + ' : ' + parseInt(collected.first().content))
                                this.channel.send(this.user + ' will lay ' + amount + ' credits on the line')
                                game_state = game_states[1]
                                this.twenty_one().catch((err) => { console.log(err) })
                            })
                            .catch((err) => {
                                this.channel.send(err_time)
                                console.log(err)
                            })
                    })

                break;
        }
    }

    ttt_place(string) {
        var y_index = parseInt(string.split(/[abc]+/g).join('')) - 1
        var x_index = null
        switch (string.split(/[123]+/g).join('')) {
            case 'a':
                x_index = 0
                break;
            case 'b':
                x_index = 1
                break;
            case 'c':
                x_index = 2
                break;
        }
        console.log(ttt_board[x_index][y_index]);
        if (x_index != null && ttt_board[x_index][y_index] == '.') {
            avalible--;
            switch(current_player) {
                case 0:
                    ttt_board[x_index][y_index] = players_index_list[current_player]
                    current_player = 1
                    break;
                case 1:
                ttt_board[x_index][y_index] = players_index_list[current_player]
                    current_player = 0
                    break;
            }
            image_builder.build_ttt_board(ttt_board, this.channel)
            this.check_winner()

        }
        else {
            this.channel.send('That cell is occupied already... please try again.')
        }
            console.log('availble : ' + avalible);
            console.log('' + x_index + ' : ' + y_index);
            console.log(ttt_board[x_index][y_index]);
            this.tic_tac_toe().catch()
    }

    is_a1_c3(msg) {
        var regex = /[abcABC][123]+/g
        return regex.test(msg)
    }

    save() {
        io.players_list[this.player_index].credits = io.players_list[this.player_index].credits + amount
        console.log(io.players_list[this.player_index].credits)
        io.store_players()
    }

    clear_everything() {
        players_cards = []
        dealers_cards = []
        amount = 0
        game_state = game_states[0]
        ttt_board = [
            ['.', '.', '.'],
            ['.', '.', '.'],
            ['.', '.', '.']
        ]
        players = ['', '']
        avalible = 9
    }

    equals_cubed(a, b, c) {
        return (a == b && b == c && a != '.')
    }

    has_face_cards(_cards) {
        var is_face_card = false
        for (i in _cards) {
            if (_cards[i] > 9 && _cards.length > 1) {
                is_face_card = true
                break;
            }
        }
        return is_face_card
    }

    check_winner() {
        var winner = null

        for (var i = 0; i < 3; i++) {
            if (this.equals_cubed(ttt_board[i][0], ttt_board[i][1], ttt_board[i][2])) {
                winner = ttt_board[i][0]
                console.log('winner at : ' + i + ' : ' + 0);
            }
        }
        for (var i = 0; i < 3; i++) {
            if (this.equals_cubed(ttt_board[0][i], ttt_board[1][i], ttt_board[2][i])) {
                winner = ttt_board[0][i]
                console.log('winner at : ' + 0 + ' : ' + i);
            }
        }
        if (this.equals_cubed(ttt_board[0][0], ttt_board[1][1], ttt_board[2][2])) {
            winner = ttt_board[0][0];
            console.log('winner at : ' + 0 + ' : ' + 0);
        }
        if (this.equals_cubed(ttt_board[2][0], ttt_board[1][1], ttt_board[0][2])) {
            winner = ttt_board[2][0];
            console.log('winner at : ' + 2 + ' : ' + 0);
        }
        if (winner == null && avalible == 0) {
            game_state = ttt_game_states[2]
            this.channel.send('The match was a draw...');
            this.clear_everything()
        }
        else if (winner != null) {
            game_state = ttt_game_states[2]
            this.channel.send(players[current_player] + " is the winner!");
            this.clear_everything()
        }
    }

    is_win(dealers_cards, players_cards) {
        var is_win = false
        var dealer_amount = this.check_cards(dealers_cards)
        var player_amount = this.check_cards(players_cards)
        console.log('Dealer amount : ' + dealer_amount + ' Player amount : ' + player_amount)
        if (dealer_amount < player_amount && player_amount <= 21 || dealer_amount > 21 && player_amount <= 21) { is_win = true }
        else { amount = -amount }
        return is_win
    }

    draw_card(_cards) {
        var ran = Math.floor(Math.random() * 12)
        console.log(ran)
        _cards.push(ran)
    }

    add_hidden_cards_to_string(_cards) {
        var string = ''
        for (var i in _cards) {
            string = string + cards[13] + ' '
        }
        return string
    }

    add_dealers_cards_to_string(_cards) {
        var string = 'Dealers cards :\n'
        for (var i in _cards) {
            string = string + cards[_cards[i]]
        }
        return string
    }

    add_player_cards_to_string(_cards) {
        var string = '\n\nPlayers cards :\n'
        for (var i in _cards) {
            string = string + cards[_cards[i]] + ' '
        }
        return string
    }

    check_for_bust(_cards) {
        if (this.check_cards(_cards) <= 21) { return false }
        else { amount = -amount; return true }
    }

    check_cards(_cards) {
        var amount = 0
        for (var i in _cards) {
            if (_cards[i] == 0 && this.has_face_cards(_cards)) {
                amount = amount + 11
            }
            else if (_cards[i] > 9) {
                amount = amount + 10
            }
            else { amount = amount + _cards[i] + 1 }
        }
        return amount
    }



    dealing(dealers_cards, players_cards) {
        this.channel.send('The dealer is dealing now.')
        var exit_condition = 2
        for (var i = 0; i < exit_condition; i = i) {
            if (this.check_cards(dealers_cards) < 16) {
                var ran = Math.floor(Math.random() * 12)
                dealers_cards.push(ran)
                console.log(ran)
            }
            else if (players_cards.length < 2) {
                var ran = Math.floor(Math.random() * 12)
                players_cards.push(ran)
                console.log(ran)
            }
            else { i = exit_condition }
        }
    }

    coin_flip() {
        var amount = 0
        var chosen_side, side_returned
        this.channel.send(questions[0])
            .then(() => {
                this.channel.awaitMessages(res => res.author == this.user && parseInt(res.content) > 0 && parseInt(res.content) <= io.players_list[this.player_index].credits, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                })
                    .then((collected) => {
                        amount = parseInt(collected.first().content)
                        console.log(collected.first().content + ' : ' + parseInt(collected.first().content))
                        this.channel.send(this.user + ' will lay ' + amount + ' credits on the line')
                    })
                    .catch((err) => {
                        this.channel.send(err_time)
                        console.log(err)
                    })
                    .then(() => {
                        this.channel.send(questions[1])
                            .then(() => {
                                this.channel.awaitMessages(res => res.author == this.user && parseInt(res.content) < 2 && parseInt(res.content) > -1, {
                                    max: 1,
                                    time: 30000,
                                    errors: ['time'],
                                })
                                    .then((collected) => {
                                        chosen_side = parseInt(collected.first().content)
                                        this.channel.send(coin_sides[chosen_side] + ' it is... Here comes the coin toss! The coin flips though the air. *swish, swish, swish,* *ping, ting, ting*')
                                        side_returned = Math.random()
                                        if (side_returned < 0.5) { side_returned = 0 }
                                        else { side_returned = 1 }
                                        if (side_returned == chosen_side) {
                                            this.channel.send("Oh it's " + coin_sides[side_returned] + '. Looks like you win ' + amount + ' credits and gained 25 exp')
                                            io.players_list[this.player_index].credits = amount + io.players_list[this.player_index].credits
                                            io.players_list[this.player_index].exp += 25
                                            console.log(io.players_list[this.player_index].credits)
                                            io.check_for_lv_up(io.players_list[this.player_index], this.channel)
                                            io.store_players()
                                        }
                                        else {
                                            this.channel.send("Well it's " + coin_sides[side_returned] + '... I think you might have lost ' + amount + '. ')
                                            io.players_list[this.player_index].credits = io.players_list[this.player_index].credits - amount
                                            console.log(io.players_list[this.player_index].credits)
                                            io.store_players()
                                        }
                                    })
                                    .catch((err) => {
                                        this.channel.send(err_time)
                                        console.log(err)
                                    })
                            })
                    })
            })

    }

}
