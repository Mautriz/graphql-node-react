import uuid from 'uuid/v4';

const Mutation = {
    createUser: (parent, args, { db }, info) => {
        const emailTaken = db.users.some(
            user => user.email === args.data.email
        );
        if (emailTaken) throw new Error('Email taken');
        const user = {
            id: uuid(),
            ...args.data
        };
        db.users.push(user);
        return user;
    },
    deleteUser: (parent, args, { db }, info) => {
        const userIndex = db.users.findIndex(user => {
            return user.id === args.id;
        });
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        const deletedUsers = db.users.splice(userIndex, 1);
        db.posts = db.posts.filter(el => {
            const match = el.author !== args.id;
            if (match) {
                db.comments = db.comments.filter(
                    comment => comment.post !== el.id
                );
            }
            return !match;
        });
        db.comments = db.comments.filter(el => el.author !== args.id);
        return deletedUsers[0];
    },

    createPost: (parent, args, { db }, info) => {
        if (!db.users.some(user => user.id === args.data.author))
            throw new Error('Invalid user');
        const post = {
            id: uuid(),
            ...args.data
        };
        db.posts.push(post);
        return post;
    },

    deletePost: (parent, args, { db }, info) => {
        const postIndex = db.posts.findIndex(post => post.id === args.id);
        if (postIndex === -1) throw new Error('Invalid id');
        const removedPost = db.posts.splice(postIndex, 1);
        db.comments = db.comments.filter(comment => comment.post !== args.id);

        return removedPost[0];
    },
    createComment: (parent, args, { db }, info) => {
        if (
            !db.users.some(user => {
                return user.id === args.data.author;
            }) &&
            !db.posts.some(el => {
                return el.id === post;
            })
        ) {
            throw new Error('Invalid post or user');
        }
        const comment = {
            id: uuid(),
            ...args.data
        };
        db.comments.push(comment);
        return comment;
    },
    deleteComment: (parent, args, { db }, info) => {
        const commentIndex = db.comments.findIndex(comment => {
            return comment.id === args.id;
        });
        if (commentIndex === -1) throw new Error('invalid id');
        const removedComment = db.comments.splice(commentIndex, 1);
        return removedComment[0];
    }
};

export default Mutation;
