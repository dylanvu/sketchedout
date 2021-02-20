function generateroomid(length) {
    var char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var roomid = '';
    for (var i = 0; i < length; i++) {
        id += char.charAt(Math.floor(Math.random() * char.length));
    }
    return roomid;
}

console.log(generateroomid(6))

export default generateroomid