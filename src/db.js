let users = [
    {
        id: '1',
        name: 'Adnrew',
        email: 'aijdad',
        age: 29
    },
    {
        id: '2',
        name: 'Mauro',
        email: 'stuff@gmail.com'
    },
    {
        id: '3',
        name: 'ok bro',
        email: 'Stuff',
        age: 999
    }
];

let posts = [
    {
        id: '103',
        title: 'Producer',
        body: 'Comoros',
        published: false,
        author: '1'
    },
    {
        id: '102',
        title: 'ROI Turnpike',
        body: 'mint green deposit Buckinghamshire',
        published: true,
        author: '2'
    },
    {
        id: '101',
        title: 'Rwanda Franc',
        body: 'Handcrafted Soft Gloves invoice',
        published: true,
        author: '2'
    }
];

let comments = [
    {
        id: '14',
        text: 'ciao',
        author: '1',
        post: '103'
    },
    {
        id: '15',
        text: 'secondo messaggio',
        author: '3',
        post: '102'
    },
    {
        id: '17',
        text: 'questo è figo',
        author: '3',
        post: '101'
    },
    {
        id: '16',
        text: 'ci sta dai',
        author: '2',
        post: '101'
    }
];

const db = {
    users,
    posts,
    comments
};

export { db as default };
