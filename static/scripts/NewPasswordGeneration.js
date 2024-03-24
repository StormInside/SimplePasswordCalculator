
class PasswordFromLetters{

    constructor(hashByteArray, length, includeSpecialChars){
        this.hashByteArray = hashByteArray;
        this.length = length;
        this.includeSpecialChars = includeSpecialChars;

        const numbers = '0123456789';
        const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
        const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const specialChars = includeSpecialChars ? '!@#$%^&*()-_=+[]{}|:,.<>?/' : '';

        this.allChars = numbers + lowerCaseLetters + upperCaseLetters + specialChars;
    }

    seededRandom(seed) {
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


    generateSeedFromSalt(salt) {
        return salt.reduce((a, b) => a + b, 0);
    }


    shuffle(array, salt) {
        let seed = this.generateSeedFromSalt(salt);
        let random = this.seededRandom(seed);

        let currentIndex = array.length;
        let randomIndex;

        while (currentIndex > 0) {
            randomIndex = Math.floor(random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    addIntToUint8Array(uint8Arr, intVal) {
        if (intVal < 0 || intVal > 255) {
            throw new Error('Integer value should be between 0 and 255 for Uint8Array');
        }

        // Create a new Uint8Array with a length one more than the current one
        let newArr = new Uint8Array(uint8Arr.length + 1);

        // Copy the contents of the old array into the new one
        newArr.set(uint8Arr);

        // Add the new integer value at the end of the new array
        newArr[newArr.length - 1] = intVal;

        return newArr;
    }

    generatePassword() {

        let charArray = this.allChars.split('');

        let shuffle_array = this.addIntToUint8Array(this.hashByteArray, this.length);
        charArray = this.shuffle(charArray, shuffle_array);

        let password = '';
        for (let i = 0; i < this.length; i++) {
            var hashByte = this.hashByteArray[i % this.hashByteArray.length];
            var hashIndex = hashByte % charArray.length;
            password += charArray[hashIndex];
        }

        let problems = {
            "no_lower": false,
            "no_upper": false,
            "no_numbers": false,
            "no_special": false
        }

//        if (!containsAnyCharacter(password, lowerCaseLetters){
//            problems["no_lower"] = true;
//        }
//        if (!containsAnyCharacter(password, upperCaseLetters){
//            problems["no_upper"] = true;
//        }
//        if (!containsAnyCharacter(password, numbers){
//            problems["no_numbers"] = true;
//        }
//        if (!containsAnyCharacter(password, specialChars && includeSpecialChars){
//            problems["no_special"] = true;
//        }

//        function resolveProblems(password, problems) {
//
//            if (isThereAProblem(problems)) {
//                console.log("The password has a problem.");
//
//
//            } else {
//                console.log("The password meets all criteria.");
//            }
//        }

        return [password, problems];
    }

    containsAnyCharacter(str, characters) {
        for (let i = 0; i < str.length; i++) {
            if (characters.includes(str[i])) {
                return true;
            }
        }
        return false;
    }

    isThereAProblem(problems) {
        return Object.values(problems).some(value => value === true);
    }

    }

//function generatePasswords(password_length = 10) {
//
//    const fs = require('fs');
//    const crypto = require('crypto');
//
//    const passwords = [];
//    const arrays = [];
//    for (let i = 0; i < 100000; i++) {
//        const buffer = crypto.randomBytes(64);
//        const testHashByteArray = Array.from(buffer);
//
//        p = new PasswordFromLetters(testHashByteArray, password_length, true);
//        const password = p.generatePassword()[0];
//        passwords.push(password);
//
//        arrays.push(testHashByteArray.join(','));
//
//    }
//
//    fs.writeFileSync('passwords_hash.txt', arrays.join('\n'));
//    fs.writeFileSync('passwords_'+password_length+'.txt', passwords.join('\n'));
//}
//
//generatePasswords(10);
//generatePasswords(20);
//generatePasswords(50);