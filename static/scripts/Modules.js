// Input class
class Input {
    constructor() {
        // Initialize attributes if any
    }

    processInput(input) {
        // Process and validate user inputs
    }

    interactWithLocalStorage(command, data) {
        // Interact with LocalStorage class
    }
}

// LocalStorage class
class LocalStorage {
    constructor() {
        this.storageName = 'saved_inputs'
        this.readStorage()
        
        if (!this.dataList){
            this.dataList = []
        }
        
        
    }

    readStorage(){
        this.dataList = JSON.parse(localStorage.getItem(this.storageName))
    }

    updateStorage(){
        localStorage.setItem(this.storageName, JSON.stringify(this.dataList));
    }

    isDataExist(newData){
        return Object.values(this.dataList).some(existingData => JSON.stringify(existingData) === JSON.stringify(newData));
    }

    storeData(username, domain, iterations, password_length, useSymbols) {
        let newData = {username: username,
                        domain: domain,
                        iterations: iterations,
                        password_length: password_length,
                        useSymbols: useSymbols
                    }
        if (!this.isDataExist(newData)){
            this.dataList.push(newData)
            this.updateStorage()
        }
    }

    retrieveData(){
        return this.dataList
    }

    removeData(indexToRemove) {
        if (indexToRemove !== -1) {
            this.dataList.splice(indexToRemove, 1);
        }
        this.updateStorage()
    }

    removeAll() {
        this.dataList = []
        this.updateStorage()
    }
}

// Hash class
class Hash {
    constructor() {}

    async createHash(
                    password,
                    salt,
                    pepper,
                    iterations = 10,
                    useSymbols = true,
                    hash_length = 32
                    )
    {
        let hash = await argon2.hash({
            pass: password,
            salt: salt+pepper+String(useSymbols),
            hashLen: hash_length,
            mem: 1024,
            time: iterations,
            parallelism: 1,
            type: argon2.ArgonType.Argon2id
        })
        return [hash.hash, hash.encoded.split('$')[hash.encoded.split('$').length - 1]]
    }

}

// Output class
class Output{
    constructor(hash, useSymbols) {
        this.hash = hash
        this.useSymbols = useSymbols
    }

    generatePassword(length) {
        p = new PasswordFromLetters(this.hash, length, this.useSymbols);
        const password = p.generatePassword()[0];
        return password;
    }
}