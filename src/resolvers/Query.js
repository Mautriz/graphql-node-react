const Query = {
    users: (parent, args, { db }, info) => {
        if (!args.query) return db.users;
        return db.users.filter(el => {
            return el.name.toLowerCase().includes(args.query.toLowerCase());
        });
    },
    posts: (parent, args, { db }, info) => {
        if (!args.query) return db.posts;
        return db.posts.filter(el => {
            const hasTitle = el.title
                .toLowerCase()
                .includes(args.query.toLowerCase());
            const hasBody = el.body
                .toLowerCase()
                .includes(args.query.toLowerCase());
            return hasTitle || hasBody;
        });
    },
    comments: (parent, args, { db }, info) => {
        if (!args.query) {
            return db.comments;
        }
        return db.comments.filter(
            comm => comm.id == args.query || comm.text === args.query
        );
    }
};

export default Query;
