import { ApolloServer } from "apollo-server-express";
import Express from "express";
import "reflect-metadata";
import { buildSchema, Query, Resolver } from "type-graphql";
import { connect } from "mongoose";

@Resolver()
class HelloResolver {
    @Query(() => String, {nullable: true})
    async hello() {
        return "Hello World"
    }
}

const main = async () => {
    const schema = await buildSchema({
        resolvers: [HelloResolver],
        dateScalarMode: "timestamp",
    });

    const mongoose = await connect('mongodb+srv://newUser:ujJc2AAKcl6RwYJr@cluster0.iwhph.mongodb.net/Cluster0?retryWrites=true&w=majority',  
        { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection;

    const server = new ApolloServer({ schema });
    const app = Express();
    server.applyMiddleware({app});
    app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready and listening at ==> http://localhost:4000${server.graphqlPath}`))
};

main().catch((error)=>{
    console.log(`ERROR: ${error}`);
})