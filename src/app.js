import express from "express";
import { connectDBMongo, connectDBPostgre } from "./config/db.js";
import {graphqlHTTP} from "express-graphql";
import schema from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js"

const app = express();

async function startServer() {
    try {
        await connectDBMongo()
        // await connectDBPostgre()

        app.use('/graphql', graphqlHTTP({
            schema: schema,
            rootValue: resolvers,
            graphiql: true
        }))

        const PORT = process.env.PORT || 300
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.log('Failed to start server', error)
    }
}

await startServer();