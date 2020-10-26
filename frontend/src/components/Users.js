import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const QUERY_USERS = gql`
  query {
    users {
      id
      name
      lastName
      userType
    }
}
`; export function UserInfo() {
    // Polling: provides near-real-time synchronization with
    // your server by causing a query to execute periodically
    // at a specified interval
    const { data, loading } = useQuery(
        QUERY_USERS, {}
    );

    // should handle loading status
    if (loading) return <p>Loading...</p>;

    return data.users.map(({ id, name, lastName, userType }) => (
        <div key={id}>
            <p>
                User - {id}: {name} {lastName} {userType}
            </p>
        </div>
    ));
}

const CREATE_USER = gql`
  mutation  createUser ($name: String!, $lastName: String!, $userType: String!){
    createUser (name: $name, lastName: $lastName, userType: $userType){
      id
      name
      lastName
      userType
    }
}
`;

export function CreateUser() {

    let inputName, inputLastName, inputUserType; 

    const [createUser] = useMutation(CREATE_USER); 

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    createUser({
                        variables: {
                            name: inputName.value,
                            lastName: inputLastName.value,
                            userType: inputUserType.value
                        }
                    }); 
                    inputName.value = '';
                    inputLastName.value = '';
                    inputUserType.value = '';
                }}
                style={{ marginTop: '2em', marginBottom: '2em' }}
            >

                <label>Name: </label>
                <input
                    ref={node => {
                        inputName = node;
                    }}
                    style={{ marginRight: '1em' }}
                />

                <label>Last Name: </label>
                <input
                    ref={node => {
                        inputLastName = node;
                    }}
                    style={{ marginRight: '1em' }}
                />
                <label>User Type: </label>
                <input
                    ref={node => {
                        inputUserType = node;
                    }}
                    style={{ marginRight: '1em' }}
                />

            <button type="submit" style={{ cursor: 'pointer' }}>Add a User</button>    
            </form>
        </div>
    );
}