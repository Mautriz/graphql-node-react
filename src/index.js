import { GraphQLServer } from 'graphql-yoga';
import uuid from 'uuid/v4';

const users = [
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
        id: 14,
        text: 'ciao',
        author: '1',
        post: '103'
    },
    {
        id: 15,
        text: 'secondo messaggio',
        author: '3',
        post: '102'
    },
    {
        id: 17,
        text: 'questo è figo',
        author: '3',
        post: '101'
    },
    {
        id: 16,
        text: 'ci sta dai',
        author: '2',
        post: '101'
    }
];

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
        post: Post!
    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput): Post!
        createComment(data: CreateCommentInput): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }
    
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    `;

const resolvers = {
    Query: {
        users: (parent, args, ctx, info) => {
            if (!args.query) return users;
            return users.filter(el => {
                return el.name.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        posts: (parent, args, ctx, info) => {
            if (!args.query) return posts;
            return posts.filter(el => {
                const hasTitle = el.title
                    .toLowerCase()
                    .includes(args.query.toLowerCase());
                const hasBody = el.body
                    .toLowerCase()
                    .includes(args.query.toLowerCase());
                return hasTitle || hasBody;
            });
        },
        comments: (parent, args, ctx, info) => {
            if (!args.query) {
                return comments;
            }
            return comments.filter(
                comm => comm.id == args.query || comm.text === args.query
            );
        }
    },

    Mutation: {
        createUser: (parent, args, ctx, info) => {
            const emailTaken = users.some(
                user => user.email === args.data.email
            );
            if (emailTaken) throw new Error('Email taken');
            const user = {
                id: uuid(),
                ...args.data
            };
            users.push(user);
            return user;
        },
        deleteUser: (parent, args, ctx, info) => {
            const userIndex = users.findIndex(user => {
                return user.id === args.id;
            });
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            const deletedUsers = users.splice(userIndex, 1);
            posts = posts.filter(el => {
                const match = el.author !== args.id;
                if (match) {
                    comments = comments.filter(
                        comment => comment.post !== el.id
                    );
                }
                return !match;
            });
            comments = comments.filter(el => el.author !== args.id);
            return deletedUsers[0];
        },

        createPost: (parent, args, ctx, info) => {
            if (!users.some(user => user.id === args.data.author))
                throw new Error('Invalid user');
            const post = {
                id: uuid(),
                ...args.data
            };
            posts.push(post);
            return post;
        },
        createComment: (parent, args, ctx, info) => {
            if (
                !users.some(user => {
                    return user.id === args.data.author;
                }) &&
                !posts.some(el => {
                    return el.id === post;
                })
            ) {
                throw new Error('Invalid post or user');
            }
            const comment = {
                id: uuid(),
                ...args.data
            };
            comments.push(comment);
            return comment;
        }
    },

    Post: {
        author: (parent, args, ctx, info) => {
            return users.find(user => user.id === parent.author);
        },
        comments: (parent, args, ctx, info) => {
            return comments.filter(comment => comment.post === parent.id);
        }
    },
    User: {
        posts: (parent, args, ctx, info) => {
            return posts.filter(post => post.author === parent.id);
        },
        comments: (parent, args, ctx, info) => {
            return comments.filter(comment => comment.author === parent.id);
        }
    },
    Comment: {
        author: (parent, args, ctx, info) => {
            return users.find(user => user.id === parent.author);
        },
        post: (parent, args, ctx, info) => {
            return posts.find(post => parent.post === post.id);
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('The server is up! PORT 4000');
});
