const Post = {
    author: (parent, args, { db }, info) => {
        const user = db.users.find(user => user.id === parent.author);
        return user;
    },
    comments: (parent, args, { db }, info) => {
        return db.comments.filter(comment => comment.post === parent.id);
    }
};

export default Post;
