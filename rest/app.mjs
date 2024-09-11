// app.mjs
import { nanoid } from 'nanoid';
import DynamoDB from 'aws-sdk/clients/dynamodb.js';


const docClient = new DynamoDB.DocumentClient();

export const FetchAllUsers = async (event, context) => {
    try {
        const data = await docClient.scan({ TableName: 'UsersDB' }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ users: data.Items }),
        };
    } catch (error) {
        console.error('Error fetching users:', error); 
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error fetching users. Please try again later.',
            }),
        };
    }
};

export const CreateUser = async (event, context) => {
    try {
        const { firstName , lastName, email,phoneNumber , password } = JSON.parse(event.body);

       
        if (!firstName || !lastName || !phoneNumber || !email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing required fields: username, email, or password',
                }),
            };
        }

        await docClient.put({
            TableName: 'UsersDB',
            Item: {
                id: nanoid(8), 
                firstName,
                lastName,
                phoneNumber,
                email,
                password,
            },
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User is created successfully' }),
        };
    } catch (error) {
        console.error('Error creating user:', error); 

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error creating user. Please try again later.',
            }),
        };
    }
};

export const DeleteUser = async (event, context) => {
    try {
        const { id } = event.pathParameters;

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'User ID is required' }),
            };
        }

        await docClient.delete({
            TableName: 'UsersDB',
            Key: {
                id,
            },
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User is deleted successfully' }),
        };
    } catch (error) {
        console.error('Error deleting user:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error deleting user. Please try again later.',
            }),
        };
    }
};

export const UpdateUser = async (event, context) => {
    try {
        const { id } = event.pathParameters;
        const { firstName ,lastName , phoneNumber, email, password } = JSON.parse(event.body);

        if (!id || !firstName ||  !lastName ||  !phoneNumber || !email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields' }),
            };
        }

        await docClient.update({
            TableName: 'UsersDB',
            Key: {
                id,
            },
            UpdateExpression: 'set firstName = :f, lastName = :l, phoneNumber = :p, email = :e, password = :p',
            ExpressionAttributeValues: {
                ':f': firstName,
                ':l': lastName,
                ':p': phoneNumber,
                ':e': email,
                ':p': password,
            },
            ReturnValues: 'UPDATED_NEW',
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User is updated successfully' }),
        };
    } catch (error) {
        console.error('Error updating user:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error updating user. Please try again later.',
            }),
        };
    }
};