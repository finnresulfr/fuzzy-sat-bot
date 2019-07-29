// JavaScript source code
const jimp = require('jimp')
const io = require('./io.js')
const Discord = require('discord.js')
const mask_path = './images/mask.png',
    lineout_path = './images/lineout.png', linein_path = './images/linein.png'
    , ava_path = './images/ava_circle.png', card_save_path = './images/card_saved.png',
    linein_mask_path = './images/linein_mask.png', font_path = './fonts/font.fnt',
    ttt_board = './images/new_ttt_board.png', ttt_x = './images/ttt_w.png', ttt_o = './images/ttt_o.png',
    ttt_save_path = './images/ttt_save.png'
const dir_list = [card_path = './images/card.png', card_purple = './images/card_purple.png', card_ieaci = './images/ieaci_card.png', card_flow = './images/card_flow.png',
        card_butterfly = './images/card_butterfly.png']

module.exports = class image_builder {

    static preview_cards (user, player_index, number, channel) {
        var avatar_url = user.avatarURL
        var player = io.players_list[player_index]
        var name = user.username, exp = player.exp, expLv = player.expLv, level = player.level, credits = player.credits, color = number
        var actual_path = dir_list[color]
        console.log(actual_path)
        var mask = jimp.read(mask_path)
            .then(m => {
                m.resize(100, 100)
                var avatar = jimp.read(avatar_url)
                    .then(ava => {
                        ava.resize(100, 100)
                        ava.quality(100)
                        ava.mask(m, 0, 0)
                        ava.write(ava_path)
                        var card = jimp.read(actual_path)
                            .then(_card => {
                                _card.background(0x00000000)
                                _card.composite(ava, 0, 0, {
                                    mode: jimp.BLEND_SOURCE_OVER,
                                    opacitySource: 1,
                                    opacityDest: 1
                                })
                                var lineout = jimp.read(lineout_path)
                                    .then(_lineout => {
                                        _card.composite(_lineout, (_card.bitmap.width / 2) - (_lineout.bitmap.width / 2), 200, {
                                            mode: jimp.BLEND_SOURCE_OVER,
                                            opacitySource: 1,
                                            opacityDest: 1
                                        })
                                        var linein_mask = jimp.read(linein_mask_path)
                                            .then(_linein_mask => {
                                                var linein = jimp.read(linein_path)
                                                    .then(_linein => {
                                                        if (exp > 0) {
                                                            var width = Math.floor(((exp / expLv) * 100) * 2)
                                                            _linein.resize(width, 50)
                                                            _linein.mask(_linein_mask, 0, 0)
                                                            _card.composite(_linein, (_card.bitmap.width / 2) - (_lineout.bitmap.width / 2), 200, {
                                                                mode: jimp.BLEND_SOURCE_OVER,
                                                                opacitySource: 1,
                                                                opacityDest: 1
                                                            })
                                                        }
                                                        var font = jimp.loadFont(font_path)
                                                            .then(_font => {
                                                                const font_width1 = jimp.measureText(_font, exp)
                                                                _card.print(_font, 110, 20, 'NAME : ' + name.toUpperCase())
                                                                _card.print(_font, 110, 40, 'LEVEL : ' + level)
                                                                _card.print(_font, 110, 60, 'CREDITS : ' + credits)
                                                                _card.print(_font, 110, 180, 'EXP : ' + exp + '/' + expLv)
                                                                _card.writeAsync(card_save_path)
                                                                        .then((err) => {
                                                                            if (err) { console.error(err) }
                                                                            channel.send(new Discord.Attachment(card_save_path, 'your_card.png'))
                                                                        })
                                                            })
                                                    })
                                            })
                                    })
                            })
                    })
                    .catch(err => { console.error(err) });
            });
    }

    static get_player_card(user, player_index, channel) {
        //todo: get image of users avatar.
        var avatar_url = user.avatarURL
        var player = io.players_list[player_index]
        var name = user.username, exp = player.exp, expLv = player.expLv, level = player.level, credits = player.credits, color = player.color
        var actual_path = dir_list[color]
        console.log(actual_path)
        var mask = jimp.read(mask_path)
            .then(m => {
                m.resize(100, 100)
                var avatar = jimp.read(avatar_url)
                    .then(ava => {
                        ava.resize(100, 100)
                        ava.quality(100)
                        ava.mask(m, 0, 0)
                        ava.write(ava_path)
                        var card = jimp.read(actual_path)
                            .then(_card => {
                                _card.background(0x00000000)
                                _card.composite(ava, 0, 0, {
                                    mode: jimp.BLEND_SOURCE_OVER,
                                    opacitySource: 1,
                                    opacityDest: 1
                                })
                                var lineout = jimp.read(lineout_path)
                                    .then(_lineout => {
                                        _card.composite(_lineout, (_card.bitmap.width / 2) - (_lineout.bitmap.width / 2), 200, {
                                            mode: jimp.BLEND_SOURCE_OVER,
                                            opacitySource: 1,
                                            opacityDest: 1
                                        })
                                        var linein_mask = jimp.read(linein_mask_path)
                                            .then(_linein_mask => {
                                                var linein = jimp.read(linein_path)
                                                    .then(_linein => {
                                                        if (exp > 0) {
                                                            var width = Math.floor(((exp / expLv) * 100) * 2)
                                                            _linein.resize(width, 50)
                                                            _linein.mask(_linein_mask, 0, 0)
                                                            _card.composite(_linein, (_card.bitmap.width / 2) - (_lineout.bitmap.width / 2), 200, {
                                                                mode: jimp.BLEND_SOURCE_OVER,
                                                                opacitySource: 1,
                                                                opacityDest: 1
                                                            })
                                                        }
                                                        var font = jimp.loadFont(font_path)
                                                            .then(_font => {
                                                                const font_width1 = jimp.measureText(_font, exp)
                                                                _card.print(_font, 110, 20, 'NAME : ' + name.toUpperCase())
                                                                _card.print(_font, 110, 40, 'LEVEL : ' + level)
                                                                _card.print(_font, 110, 60, 'CREDITS : ' + credits)
                                                                _card.print(_font, 110, 180, 'EXP : ' + exp + '/' + expLv)
                                                                _card.writeAsync(card_save_path)
                                                                        .then((err) => {
                                                                            if (err) { console.error(err) }
                                                                            channel.send(new Discord.Attachment(card_save_path, 'your_card.png'))
                                                                        })
                                                            })
                                                    })
                                            })
                                    })
                            })
                    })
                    .catch(err => { console.error(err) });
            });
    }

    static build_ttt_board(board2dArray, channel) {
        console.log(board2dArray[1][1]);
        var board_2d = new jimp(ttt_board, function (err, image) {
            err ? console.log(err) : console.log('Board drawn.');
            return image
        })
        var x_image = new jimp(ttt_x, function (err, image) {
            err ? console.log(err) : console.log('x drawn');
            return image
        })
        var o_image = new jimp(ttt_o, function (err, image) {
            err ? console.log(err) : console.log('o drawn');
            return image
        })
        jimp.read(ttt_board)
        .then((image) => {
            if (board2dArray[0][0] == 'x') {
                board_2d.composite(x_image, 0, 0, {
                    mode: jimp.BLEND_SOURCE_OVER,
                    opacitySource: 1,
                    opacityDest: 1
                })
            }
            else if (board2dArray[0][0] == 'o') {
                board_2d.composite(o_image, 0, 0, {
                    mode: jimp.BLEND_SOURCE_OVER,
                    opacitySource: 1,
                    opacityDest: 1
                })
            }
            jimp.read(ttt_board)
            .then((image) => {
                if (board2dArray[0][1] == 'x') {
                    board_2d.composite(x_image, 140, 0, {
                        mode: jimp.BLEND_SOURCE_OVER,
                        opacitySource: 1,
                        opacityDest: 1
                    })
                }
                else if (board2dArray[0][1] == 'o') {
                    board_2d.composite(o_image, 140, 0, {
                        mode: jimp.BLEND_SOURCE_OVER,
                        opacitySource: 1,
                        opacityDest: 1
                    })
                }
                jimp.read(ttt_board)
                .then((image) => {
                    if (board2dArray[0][2] == 'x') {
                        board_2d.composite(x_image, 285, 0, {
                            mode: jimp.BLEND_SOURCE_OVER,
                            opacitySource: 1,
                            opacityDest: 1
                        })
                    }
                    else if (board2dArray[0][2] == 'o') {
                        board_2d.composite(o_image, 285, 0, {
                            mode: jimp.BLEND_SOURCE_OVER,
                            opacitySource: 1,
                            opacityDest: 1
                        })
                    }
                    jimp.read(ttt_board)
                    .then((image) => {
                        if (board2dArray[1][0] == 'x') {
                            board_2d.composite(x_image, 0, 140, {
                                mode: jimp.BLEND_SOURCE_OVER,
                                opacitySource: 1,
                                opacityDest: 1
                            })
                        }
                        else if (board2dArray[1][0] == 'o') {
                            board_2d.composite(o_image, 0, 140, {
                                mode: jimp.BLEND_SOURCE_OVER,
                                opacitySource: 1,
                                opacityDest: 1
                            })
                        }
                        jimp.read(ttt_board)
                        .then((image) => {
                            if (board2dArray[1][1] == 'x') {
                                board_2d.composite(x_image, 140, 140, {
                                    mode: jimp.BLEND_SOURCE_OVER,
                                    opacitySource: 1,
                                    opacityDest: 1
                                })
                            }
                            else if (board2dArray[1][1] == 'o') {
                                board_2d.composite(o_image, 140, 140, {
                                    mode: jimp.BLEND_SOURCE_OVER,
                                    opacitySource: 1,
                                    opacityDest: 1
                                })
                            }
                            jimp.read(ttt_board)
                            .then((image) => {
                                if (board2dArray[1][2] == 'x') {
                                    board_2d.composite(x_image, 285, 140, {
                                        mode: jimp.BLEND_SOURCE_OVER,
                                        opacitySource: 1,
                                        opacityDest: 1
                                    })
                                }
                                else if (board2dArray[1][2] == 'o') {
                                    board_2d.composite(o_image, 285, 140, {
                                        mode: jimp.BLEND_SOURCE_OVER,
                                        opacitySource: 1,
                                        opacityDest: 1
                                    })
                                }
                                jimp.read(ttt_board)
                                .then((image) => {
                                    if (board2dArray[2][0] == 'x') {
                                        board_2d.composite(x_image, 0, 285, {
                                            mode: jimp.BLEND_SOURCE_OVER,
                                            opacitySource: 1,
                                            opacityDest: 1
                                        })
                                    }
                                    else if (board2dArray[2][0] == 'o') {
                                        board_2d.composite(o_image, 0, 285, {
                                            mode: jimp.BLEND_SOURCE_OVER,
                                            opacitySource: 1,
                                            opacityDest: 1
                                        })
                                    }
                                    jimp.read(ttt_board)
                                    .then((image) => {
                                        if (board2dArray[2][1] == 'x') {
                                            board_2d.composite(x_image, 140, 285, {
                                                mode: jimp.BLEND_SOURCE_OVER,
                                                opacitySource: 1,
                                                opacityDest: 1
                                            })
                                        }
                                        else if (board2dArray[2][1] == 'o') {
                                            board_2d.composite(o_image, 140, 285, {
                                                mode: jimp.BLEND_SOURCE_OVER,
                                                opacitySource: 1,
                                                opacityDest: 1
                                            })
                                        }
                                        jimp.read(ttt_board)
                                        .then((image) => {
                                            if (board2dArray[2][2] == 'x') {
                                                board_2d.composite(x_image, 285, 285, {
                                                    mode: jimp.BLEND_SOURCE_OVER,
                                                    opacitySource: 1,
                                                    opacityDest: 1
                                                })
                                            }
                                            else if (board2dArray[2][2] == 'o') {
                                                board_2d.composite(o_image, 285, 285, {
                                                    mode: jimp.BLEND_SOURCE_OVER,
                                                    opacitySource: 1,
                                                    opacityDest: 1
                                                })
                                            }
                                            jimp.read(ttt_board)
                                            .then((image) => {
                                                board_2d.write(ttt_save_path, (err, success) => { err ? console.log(err) : console.log('Image written.') })
                                                jimp.read(ttt_board)
                                                .then((image) => {
                                                    channel.send(new Discord.Attachment(ttt_save_path, 'ttt_board.png'))
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }

}
