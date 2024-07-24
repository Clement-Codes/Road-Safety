import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.roadsafety',
    projectId: '66a119a800275c09da52',
    databaseId: '66a11abf000c8a8b486b',
    userCollectionId: '66a11ad800061cbcf3d9',
    videoCollectionId: '66a11b06001ee4f88efa',
    storageId: '66a11c150032f9957728'
}


const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client)

export const createUser = async(email, password, username) => {
    try{
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        
        if(!newAccount) throw Error

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            },
        );

        return newUser;
    } catch(error){
        console.log(error);
        throw new Error(error);
    }
    // account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
    // .then(
    //     function (response){
    //     console.log(response);
    // }, function (error){
    //     console.log(error);
    // });
}

export const  signIn = async(email, password) => {
    try{
        const session = await account.createEmailPasswordSession(email, password)
        return session
    }catch(error){
        console.log(error)
        throw new Error(error);
    }
}

export const getCurrentUser = async() => {
    try{
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
           [ Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
        
    } catch (error) {
        console.log(error);
    }
}