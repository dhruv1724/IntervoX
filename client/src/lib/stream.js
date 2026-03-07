import { StreamVideoClient } from "@stream-io/video-react-sdk";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

let client=null

//to connect to the stream service by creating a stream client
export const initializeStreamClient = async (user,token)=>{
    //if client exists with the same user instead of creating again just return it
    if(client && client?.user?.id === user.id) return client

    if(client){
      await client.disconnectStreamClient();
    }

    if(!apiKey) throw new Error("Stream Api Key is not provided")
    client = new StreamVideoClient({
        apiKey,
        user,
        token
    })

    return client
}

//for disconnecting
export const disconnectStreamClient = async () => {
  if (client) {
    try {
      await client.disconnectUser();
      client = null;
    } catch (error) {
      console.error("Error disconnecting Stream client:", error);
    }
  }
};