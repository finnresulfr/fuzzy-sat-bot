const loading = ['Loading', 'Loading.', 'Loading..', 'Loading...']
var done = true;
var bad_words = ['fag', 'fags', 'fagg', 'faggs', 'faggot', 'faggots', 'furfag', 'furfags', 'furfaggots', 'furfaggot', 'furfagot', 'furfagots', 'nigga', 'niggas','nibba', 'nigger', 'niggers','spic', 'nazi', 'hitler', "hitler's", 'pedo', 'pedophilia', 'pedophile', 'rape', 'rapist', 'raping', 'molest', 'molestation', 'retard', 'retarded']
var good_words = ['area', 'book', 'business', 'case', 'child', 'company', 'country', 'day', 'eye', 'fact', 'family', 'government', 'group', 'hand', 'home', 'job', 'life', 'lot', 'man', 'money', 'month', 'mother']
module.exports = class string_builder {

    static build_loading(channel) {
        done = false
        var load_tic = 1
        channel.send('Loading')
        var interval = setInterval(function () {
            channel.fetchMessages({ limit: 1 }).then(msg => {
                let last_msg = msg.first()
                if (last_msg.author.bot && !this.done) {
                    last_msg.edit(loading[load_tic])
                    load_tic++
                }
                if (load_tic == loading.length - 1) {
                    load_tic = 0
                }
            })
        }, 500);
    }
    static set_done(_done) { this.done = _done }

    static check_bad_words(msg) {
        // Bool for checking if bad word is in sentence
        var is_bad_word = false
        //splits the words at the . and rejoins them with empty
        var string = msg.content.split('.').join('')

        string = string.split('@').join('a')
        //splits the words for individual checking
        var strings = string.split(' ')
        //nested loop for two arrays the bad words[] and the string[]
        for (var i in strings) {
            for (var j in bad_words) {
                //splits with a regex and joins with empty
                //The regex checks for any non word chars and underscore
                strings[i] = strings[i].split(/[^\w]|_+/g).join('')
                if (strings[i].toLowerCase() == bad_words[j]) {
                    is_bad_word = true
                    //Get a random number from 0 to 21(good_words.length - 1)
                    var rand = Math.floor(Math.random() * 21)
                    //Replace the bad word with the good word.
                    strings[i] = good_words[rand]
                    console.log(strings[i]);
                }
            }
        }
        //checks for bad word condition and if true
        // deletes the message and issues a warning
        if (is_bad_word) {
            msg.delete()
            msg.channel.send(string_builder.string_builder(strings))
            msg.reply('we do not speak that way on this server.')
        }
    }

    static string_builder(strings) {
        var constructed_string = ""
        var iterator = 0
        for (var i in strings) {
            if (strings.length -1 > iterator) {
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
}
