export interface User {
    id: number,
    age: number,
    firstName: string,
    lastName: string,
};

interface UserData {
    count: number,
    users: Array<User>,
};

const userData: UserData = {
    count: 1,
    users: [{id: 0, firstName: 'Pesko', lastName: 'Pekar', age: 35}],
};

export { userData };