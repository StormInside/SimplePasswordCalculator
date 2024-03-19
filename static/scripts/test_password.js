
function seededRandom(seed) {
    var mask = 0xffffffff;
    var m_w  = (123456789 + seed) & mask;
    var m_z  = (987654321 - seed) & mask;

    return function() {
      m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
      m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;

      var result = ((m_z << 16) + m_w) & mask;
      result /= 4294967296;
      return result + 0.5;
    };
}


function generateSeedFromSalt(salt) {
    return salt.reduce((a, b) => a + b, 0);
}


function shuffle(array, salt) {
    let seed = generateSeedFromSalt(salt);
    let random = seededRandom(seed);

    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex > 0) {
        randomIndex = Math.floor(random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}


function generatePassword(hashByteArray, length, includeSpecialChars = false) {
    if (!Array.isArray(hashByteArray) || length < 10 || length > 50) {
        throw new Error("Invalid input");
    }

    const numbers = '0123456789';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = includeSpecialChars ? '!@#$%^&*()-_=+[]{}|:,.<>?/' : '';
    const allChars = numbers + lowerCaseLetters + upperCaseLetters + specialChars;
    let charArray = allChars.split('');

    charArray = shuffle(charArray, hashByteArray);

    let password = '';
    for (let i = 0; i < length; i++) {
        var hashByte = hashByteArray[i % hashByteArray.length];
        var hashIndex = hashByte % charArray.length;
        password += charArray[hashIndex];
    }

    problems = {
        "no_lower": false,
        "no_upper": false,
        "no_numbers": false,
        "no_special": false
    }

//    if (!containsAnyCharacter(password, lowerCaseLetters){
//        problems["no_lower"] = true;
//    }
//    if (!containsAnyCharacter(password, upperCaseLetters){
//        problems["no_upper"] = true;
//    }
//    if (!containsAnyCharacter(password, numbers){
//        problems["no_numbers"] = true;
//    }
//    if (!containsAnyCharacter(password, specialChars && includeSpecialChars){
//        problems["no_special"] = true;
//    }

    return [password, problems];
}

function containsAnyCharacter(str, characters) {
    for (let i = 0; i < str.length; i++) {
        if (characters.includes(str[i])) {
            return true;
        }
    }
    return false;
}

function isThereAProblem(problems) {
    return Object.values(problems).some(value => value === true);
}

//function resolveProblems(password, problems) {
//
//    if (isThereAProblem(problems)) {
//        console.log("The password has a problem.");
//
//
//    } else {
//        console.log("The password meets all criteria.");
//    }
//}

//var testHashByteArray = [5,51,105,2,194,83,46,120,119,241,126];
//var res = generatePassword(testHashByteArray, 10, true);
//
//console.log('Generated Password:', res[0]);
//console.log('Problems:', res[1]);

function generatePasswords(password_length = 10) {

    const fs = require('fs');
    const crypto = require('crypto');

    const passwords = [];
    const arrays = [];
    for (let i = 0; i < 100000; i++) {
        const buffer = crypto.randomBytes(64);
        const testHashByteArray = Array.from(buffer);
        const password = generatePassword(testHashByteArray, password_length, true)[0];
        passwords.push(password);

        arrays.push(testHashByteArray.join(','));

    }

    fs.writeFileSync('passwords_hash.txt', arrays.join('\n'));
    fs.writeFileSync('passwords_'+password_length+'.txt', passwords.join('\n'));
}

generatePasswords(10);
generatePasswords(20);
generatePasswords(50);
