// Player data collection class

function Player(name, role, color, level, exp, expLv, stats, inventory, credits) {
    this.name = name
    this.role = role
    this.level = level
    this.color = color
    this.exp = exp
    this.expLv = expLv
    this.stats = stats
    this.inventory = inventory
    this.credits = credits
    console.log('A new player has joined expodition. ' + name  + ' : ' + color)
}

module.exports = Player;