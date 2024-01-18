// const wordList = require("./wordlist.js")
// const argon2 = require("argon2");
// const custom_argon2 = require("./argon2.js");


function chooseNumberOfWords(hash) {
    // Use the first byte of the hash to decide between 2 or 3 words
    return (hash[0] % 2) + 3;
}

function getWordFromIndex(index) {
    index = ((index % wordList.length) + wordList.length) % wordList.length;
    return wordList[index];
}

function chooseWords(hash, numWords) {
    const indices = [];
    for (let i = 0; i < numWords; i++) {
        indices.push(
            (hash[i * 4] << 24 |
             hash[i * 4 + 1] << 16 |
             hash[i * 4 + 2] << 8 |
             hash[i * 4 + 3]) % wordList.length
        );
    }
    // console.log(indices)

    return indices.map(getWordFromIndex);
}

function getNumberFromBytes(bytes, max) {
    let num = 0;
    for (let i = 0; i < bytes.length; i++) {
        num = (num << 8) | bytes[i];
    }
    return num % (max + 1);
}

function getBooleanFromByte(byte) {
    return (byte & 0x01) === 1;
}

function modifyWords(hash, words, characters) {
    const words_modified = []

    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        const hashByteArray = hash.slice(i * 7, i * 7 + 7);

        const shouldModify = getBooleanFromByte(hashByteArray[0]);
        const shouldCapitalize = getBooleanFromByte(hashByteArray[1]);
        const slice1 = hashByteArray.slice(2, 4);
        const slice2 = hashByteArray.slice(4, 6);
        const charPosition = getNumberFromBytes(slice1, word.length - 1);
        const repCharPosition = getNumberFromBytes(slice2, characters.length - 1);

        let mod_word = word;
        const replacementChar = characters[repCharPosition];

        if (shouldModify) {
            mod_word = mod_word.substring(0, charPosition) + replacementChar + mod_word.substring(charPosition + 1);
        }

        if (shouldCapitalize) {
            const capPosition = getNumberFromBytes(hashByteArray.slice(6, 7), word.length - 1);
            mod_word = mod_word.split('').map((c, idx) => idx === capPosition ? c.toUpperCase() : c).join('');
        }

        words_modified.push(mod_word);
    }

    return words_modified;
}


function insertBetweenWords(hash, words, characters) {
    result = ""
    for (let i = 0; i < words.length; i++) {

        const hashByteArray = hash.slice(i * 6, i * 6 + 6);
        
        const slice1 = hashByteArray.slice(0, 2)
        const slice2 = hashByteArray.slice(2, 4)
        const slice3 = hashByteArray.slice(4, 6)

        // console.log({sl1: [slice1[0], slice1[1]], sl2: [slice2[0], slice2[1]], sl3: [slice3[0], slice3[1]]})

        const charsCount = getNumberFromBytes(slice1, 2)+1;
        const charIds = [getNumberFromBytes(slice2, characters.length-1), getNumberFromBytes(slice3, characters.length-1)]
        
        // console.log({charsCount: charsCount, charIds: charIds})

        result = result + words[i]

        for (let j = 0; j < charsCount; j++){
            result = result + characters[charIds[j]]
        }
        
    }
    return result
}

function generatePassword(hash, useSymbols) {
    const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?/"
    const numbers = "0123456789"
    let characters = numbers+symbols

    if (!useSymbols){
        characters = numbers
    }

    let numWords = chooseNumberOfWords(hash)
    // console.log(numWords)

    let words = chooseWords(hash, numWords)
    // console.log(words)

    let modifiedWords = modifyWords(hash, words, characters)
    // console.log(modifiedWords)

    let password = insertBetweenWords(hash, modifiedWords, characters)

    return password;
}