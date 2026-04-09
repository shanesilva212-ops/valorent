import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "vehicle-rental" });

// Function to save user data to database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    const { data } = event

    // check if user already exists in database

    const user = await prisma.user.findFirst({
        where: {id: data.id}
    })

    if(user){
        // Update user data if it exists

        await prisma.user.update({
            where: {id: data.id},
            data: {
                email: data.email_addresses[0].email_address,
                name: data.first_name + " " + data.last_name,
                image: data.profile_image_url,
            }
        })
        return;
    }
  await prisma.user.create({
    data: {
        id: data.id,
        email: data.email_addresses[0].email_address,
        name: data.first_name + " " + data.last_name,
        image: data.profile_image_url,
    }
  })
  }
);

// Inngest function to delete user from database

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    const { data } = event

    const listings = await prisma.listing.findMany({
        where: {ownerId: data.id}
    })

    const chats = await prisma.chat.findMany({
        where: {OR: [{ ownerUserId: data.id }, { chatUserId: data.id }]}
    })

    if(listings.length === 0 && chats.length === 0){
        await prisma.user.delete({where: {id: data.id}})
    }else{
        await prisma.listing.updateMany({
            where: {ownerId: data.id},
            data: {status: "inactive"}
        })
    }
},
);

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk", triggers: [{ event: "clerk/user.updated" }] },
  async ({ event }) => {
    const { data } = event

    await prisma.user.update({
        where: {id: data.id},
        data: {
            email: data.email_addresses[0].email_address,
            name: data.first_name + " " + data.last_name,
            image: data.profile_image_url,
        }
    })
  }
);


// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation
];