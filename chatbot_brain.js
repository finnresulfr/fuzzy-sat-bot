// JavaScript source code
//Todo add custom superscript parser
const fs = require('fs')
const { NlpManager } = require('node-nlp')
const minified = false;
const manager = new NlpManager({ languages: ['en'] })
const commands = ["train", "export"]
const path = "export_bot_brain.json"
const nlp = require('compromise')

module.exports = class BotBrain {

    async train() {
        manager.addDocument('en', 'Goodbye for now.', 'greetings.bye')
        manager.addDocument('en', 'Goodbye.', 'greetings.bye')
        manager.addDocument('en', 'Bye bye, you take care now.', 'greetings.bye')
        manager.addDocument('en', "I'll talk to you later I guess", 'greetings.bye')
        manager.addDocument('en', 'Hello.', 'greetings.hello')
        manager.addDocument('en', 'Hello, how are you?', 'greetings.hello')
        manager.addDocument('en', 'Hey', 'greetings.hello')
        manager.addDocument("en", "What's going on today?", "greetings.hello")

        manager.addAnswer('en', 'greetings.bye', 'Till next time.')
        manager.addAnswer('en', 'greetings.bye', "I'll talk to you later I guess")
        manager.addAnswer('en', 'greetings.bye', 'Goodbye')
        manager.addAnswer('en', 'greetings.bye', 'Goodbye for now.')
        manager.addAnswer('en', 'greetings.bye', 'Bye bye, you take care now')

        manager.addAnswer('en', 'greetings.hello', 'Hello.')
        manager.addAnswer('en', 'greetings.hello', 'Hello, how are you?')
        manager.addAnswer('en', 'greetings.hello', 'Hey.')
        manager.addAnswer('en', 'greetings.hello', "What's going on today?")

        try {
            await manager.train()
        }
        catch (error) { console.log(error) }
        manager.save()
    }

    export_brain() {
        const data = manager.export(minified);
        fs.writeFileSync(path, data, 'utf8', (err) => { if (err) { console.log(err) } else { console.log('Writen to file.') } })
    }



    async respond(string, message) {
        var doc = nlp.statement(string)
        var output = doc.negate().text()
        console.log(doc)
        if (string == commands[0]) { this.train(); console.log("manager trains the bot's brain.") }
        else if (string == commands[1]) { this.export_brain() }
        else {
            var response
            try {
                response = await manager.process('en', string)
            }
            catch (error) { console.log(error) }
            console.log(response)
            message.reply(response['answer'])
            message.reply(doc.out('text'))
        }
    }
}