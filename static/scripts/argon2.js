

function pad_input(input, length) {
    let res_str = input.repeat(Math.ceil(length / input.length));
    return res_str.slice(0, length);
}


async function custom_argon2(password,
                            salt,
                            pepper,
                            iterations = 10,
                            hash_length = 32
                            )
{
    const hash = await argon2.hash({
        pass: password,
        salt: salt+password, 
        secret:new ArrayBuffer(pepper),
        hashLen: hash_length,
        mem: 1024,
        time: iterations,
        parallelism: 1,
        type: argon2.ArgonType.Argon2id
    })
    return [hash.hash, hash.encoded.split('$')[hash.encoded.split('$').length - 1]]
}

async function transform_hash(b_hash, dont_use_symbols=false){
    
    characters = {
        "V": "AEIOU",
        "C": "BCDFGHJKLMNPQRSTVWXYZ",
        "v": "aeiou",
        "c": "bcdfghjklmnpqrstvwxyz",
        "n": "0123456789",
        "s": "@&%?,=[]_:-+*$#!'^~;()/."
    }

    patterns = [
        'cCcvnvcnsvcvcCsCvC',
        'vccncvCsVCvCVCv',
        'ccvcVncCvnscCcv',
        'sCvCvcnVcsCvnc',
        'vcvCVcccVcVnVCsVCV',
        'cvcsnccVccsvcv',
        'vCvcVcVsVcCnccv',
        'nnccCvsncCvcvcVc',
        'cvCVcCCsccvsvcCVcc',
        'cVcnnVcVCcVCCsc',
        'cncVcVcvCVcvCs',
        'cVcccvcsnncVcvc',
        'ccVcCvcvCvcsCnCscC',
        'cccVnCCvcsnnVC',
        'VcnvscVccvCvcscc',
        'CvCvcscVcVcscvnncv',
        'VcvsVCvcVCVccVscccvn',
        'CCncVssvCvCVcvccVcn',
        'VCCVCvnvCCnvsCv',
        'nCVccsVcCcscVCccv',
        'vcvCCCVcvcCnvCcvscv',
        'sscvcvcnvncvnC',
        'ccVsVCcvccnnvcsCv',
        'cvcVccnCsCVcvcCnn',
        'vcsCvcnCVcccVcVC',
        'svCvcVsncCvcvcv',
        'VscnVCvcVncvCcnv',
        'vnssvcvCvCVCCCV',
        'ncvCcscnvCcCvc',
        'nCVCvCccvcscCvn',
        'vCvcVcvnCcVsVCsccvc',
        'vnVsVcCcvCcvscc',
    ]

    pattern = patterns[b_hash[0] % patterns.length]
    // console.log(b_hash[0])
    // console.log("pattern_id", b_hash[0] % patterns.length, "pattern", pattern)
    i=1
    password = ""
    for (let character of pattern) {
        chars = characters[character]
        if (character == 's' && dont_use_symbols){
            chars = characters['n'] 
        }
        char = chars[b_hash[i] % chars.length]
        password = password+char
        // console.log(b_hash[i])
        // console.log("char_id", b_hash[i] % chars.length, "chars", chars, "char", char)
        i=i+1
      }

    return password
}


async function test(){
    let username = "mail@gmai.com"
    let page_url = "google.com"
    let user_secret = "monkey_w1th_b@nana_17"

    let iterations = 20

    let dont_use_symbols = false

    while (iterations <= 100){
        result_hash = await custom_argon2(user_secret, username, page_url, iterations)
        console.log(result_hash)

        result_password = await transform_hash(result_hash[0], dont_use_symbols)
        console.log(result_password)
        iterations=iterations+2
    }

}