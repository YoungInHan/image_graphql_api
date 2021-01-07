import { ApolloServer } from "apollo-server-express";
import Express from "express";
import "reflect-metadata";
import { buildSchema, Query, Resolver } from "type-graphql";
import { connect } from "mongoose";

@Resolver()
class HelloResolver {
    @Query(() => String)
    async hello() {
        return "Hello World"
    }
}

const main = async () => {
    const schema = await buildSchema({
        resolvers: [HelloResolver],
    });

    // const mongoose = await connect('mongodb://localhost:27017/test', {useNewUrlParser: true});
    // await mongoose.connection;

    const server = new ApolloServer({ schema });
    const app = Express();
    server.applyMiddleware({app});
    app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready and listening at ==> http://localhost:4000${server.graphqlPath}`))
};

main().catch((error)=>{
    console.log(`ERROR: ${error}`);
})