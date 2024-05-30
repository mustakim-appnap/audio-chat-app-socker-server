const UserRepository = require('../repositories/UserRepository');
class UserService {

    constructor()
    {
        this.users = [];
    }
    
    userJoined(id, room) {
        const user = {id, room};

        this.users.push(user);
        return user;
    }

    getCurrentUser(id) {
        return this.users.find(user => user.id === id);
    }

    userLeft(id) {
        const index = this.users.findIndex(user => user.id === id);

        if(index !== -1) {
            return this.users.splice(index, 1)[0];
        }
    }

    getRoomUsers(room) {
        return this.users.filter(user => user.room === room);
    }

    updateChannelStatus(data, userCount)
    {
        return UserRepository.updateChannelStatus(data, userCount);
    }

    addChannelJoiningHistory(data)
    {
        return UserRepository.addChannelJoiningHistory(data);
    }

    removeChannelJoiningHistory(data)
    {
        return UserRepository.removeChannelJoiningHistory(data);
    }


}



module.exports = new UserService();
