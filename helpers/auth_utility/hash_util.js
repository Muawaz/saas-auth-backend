const bcrypt = require('bcryptjs')

exports.Hash_Password = async (password) => {
    let hash = await bcrypt.hash(password, 10);
    return hash
}

exports.De_Hash_Password = async (password, hash) => {
    let result = await bcrypt.compare(password, hash);
    return result;
}
