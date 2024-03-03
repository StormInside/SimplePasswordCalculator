const wordList = require('./wordlist_test');

class Output{
    constructor(hash, useSymbols) {

        // Creating string with characters that will be added to result password
        const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?/"
        const numbers = "0123456789"
        this.characters = numbers+symbols
        if (!useSymbols){
            this.characters = numbers
        }

        this.words = []
        this.wordsCount = null
        this.modifiedWords = []
        this.password = null

        this.hash = hash
        this.wordList = wordList
    }

    chooseNumberOfWords() {
        // Use the first byte of the hash to decide between 3 or 4 words
        this.wordsCount = (this.hash[0] % 2) + 3;
    }

    getWordByIndex(id) {
        let _words = this.wordList
        return _words[((id % _words.length) + _words.length) % _words.length];
    }

    chooseWords() {
        const indices = [];
        for (let i = 0; i < this.wordsCount; i++) {
            indices.push(
                (this.hash[i * 4] << 24 |
                 this.hash[i * 4 + 1] << 16 |
                 this.hash[i * 4 + 2] << 8 |
                 this.hash[i * 4 + 3]) % this.wordList.length
            );
        }
        // console.log(indices)

        for (let i = 0; i < this.wordsCount; i++) {
            this.words.push(this.getWordByIndex(indices[i]))
        }
    }

    getNumberFromBytes(bytes, max) {
        let num = 0;
        for (let i = 0; i < bytes.length; i++) {
            num = (num << 8) | bytes[i];
        }
        return num % (max + 1);
    }

    getBooleanFromByte(byte) {
        return (byte & 0x01) === 1;
    }

    modifyWords() {
        const words_modified = [];

        for (let i = 0; i < this.wordsCount; i++) {
            let word = this.words[i];

            // Step 1: Convert word to uppercase with a 30% chance for each character
            let mod_word = word.split('').map((c, idx) => {
                // Calculate the hash index for this character
                let hashIndex = (i * word.length + idx) % this.hash.length;
                let hashValue = this.hash[hashIndex];

                // Convert hash byte to a number between 0 and 100
                let chance = (hashValue / 255) * 100;

                // 30% chance to convert to uppercase
                return chance < 30 ? c.toUpperCase() : c;
            }).join('');

            // Step 2: Replace characters with symbols as in original code
//            const hashByteArray = this.hash.slice(i * 5, i * 5 + 5);
//            const shouldModify = this.getBooleanFromByte(hashByteArray[0]);
//            const slice1 = hashByteArray.slice(1, 3);
//            const slice2 = hashByteArray.slice(3, 5);
//
//            const charPosition = this.getNumberFromBytes(slice1, mod_word.length - 1);
//            const repCharPosition = this.getNumberFromBytes(slice2, this.characters.length - 1);
//
//            if (shouldModify) {
//                const replacementChar = this.characters[repCharPosition];
//                mod_word = mod_word.substring(0, charPosition) + replacementChar + mod_word.substring(charPosition + 1);
//            }

            words_modified.push(mod_word);
        }
        this.modifiedWords = words_modified;
    }

    insertBetweenWords() {
        let result = "";
        for (let i = 0; i < this.wordsCount; i++) {

            const hashByteArray = this.hash.slice(i * 6, i * 6 + 6);

            const slice1 = hashByteArray.slice(0, 2);
            const slice2 = hashByteArray.slice(2, 4);
            const slice3 = hashByteArray.slice(4, 6);

            const charsCount = this.getNumberFromBytes(slice1, 2);
            const charIds = [
                this.getNumberFromBytes(slice2, this.characters.length-1),
                this.getNumberFromBytes(slice3, this.characters.length-1)
            ];

            result += this.modifiedWords[i]; // Use modified words

            for (let j = 0; j < charsCount; j++) {
                result += this.characters[charIds[j]];
            }

        }
        this.password = result;
    }

    generatePassword() {

        this.chooseNumberOfWords()
        this.chooseWords()
        this.modifyWords()
        this.insertBetweenWords()

        return this.password;
    }
}

const fs = require('fs');
const crypto = require('crypto');

const passwords = [];
const arrays = [];
for (let i = 0; i < 100000; i++) {
    const buffer = crypto.randomBytes(64);
    const testHashByteArray = Array.from(buffer);
    o = new Output(buffer, true)
    const password = o.generatePassword();
    passwords.push(password);

    arrays.push(testHashByteArray.join(','));

}

fs.writeFileSync('passwords_hash_old.txt', arrays.join('\n'));
fs.writeFileSync('passwords_old.txt', passwords.join('\n'));
