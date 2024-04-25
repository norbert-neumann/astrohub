import { createApp } from "./app.js";
import { connectToMongo } from "./mongo-storage.js";

const repository = await connectToMongo('mongodb+srv://neumann_norbert:projektmunka123@astrohubcluster.da8nsca.mongodb.net/?retryWrites=true&w=majority&appName=AstroHubCluster')
console.log(repository)
const app = createApp(repository)

app.listen(3000, () => {
    console.log('service running on port 3000')
})