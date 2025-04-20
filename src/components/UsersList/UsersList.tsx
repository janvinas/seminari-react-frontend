import React from "react";
import { User } from '../../types';
import styles from './UsersList.module.css'; // Import CSS module

interface Props {
    users: User[];
    selectUser: (user: User | null) => void;
}

const UsersList: React.FC<Props> = ({ users, selectUser }) => {
    const renderList = (): React.ReactNode[] => {
        return users.map((user) => (
            <li key={user.name} className={styles.listItem} onClick={() => selectUser(user)}>
                <div className={styles.userInfo}>
                    <h2 className={styles.user}>{user.name}</h2>
                    <h3 className={styles.age}>Age: {user.age}</h3>
                    <p className={styles.email}>{user.email}</p>
                </div>
            </li>
        ));
    };

    return (
        <ul className={styles.list}>
            {renderList()}
        </ul>
    );
};

export default UsersList;