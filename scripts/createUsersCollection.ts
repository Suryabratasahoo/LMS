import clientPromise from "@/lib/connectDb";



async function createUsersCollection() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB as string);

    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name','category','subcategory', 'email', 'password'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'Name is required and must be a string',
            },
            category:{
                bsonType:'string',
                description:"Category is required and must be a string"
            },
            subcategory:{
                bsonType:'string',
                description:"SubCategory is required and must be a string"
            },
            email: {
              bsonType: 'string',
              pattern: '^.+@.+$',
              description: 'Email is required and must be a valid email address',
            },
            password: {
              bsonType: 'string',
              minLength: 6,
              description: 'Password is required and must be at least 6 characters long',
            },
            createdAt: {
              bsonType: 'date',
              description: 'CreatedAt must be a date',
            },
          },
        },
      },
    });

    console.log('Users collection created successfully with validation rules!');
  } catch (error) {
    console.error('Error creating users collection:', error);
  }
}

createUsersCollection();
