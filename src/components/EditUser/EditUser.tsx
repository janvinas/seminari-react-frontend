import { User } from "../../types";
import "./EditUser.css"
import formStyles from "../Form/Form.module.css"
import { useReducer } from "react";
import { editUser } from "../../services/usersService";

export default function EditUser(
    { user, onEditUser }:
    { user: User, onEditUser: () => void}
) { 

    function getInitialData(user: User): Partial<User> {
        return {
            age: user.age,
            email: user.email,
            password: "",
            name: user.name,
        }
    }

    type FormReducerAction =
    | { 
        type: "change_value"; 
        payload: { 
            inputName: keyof User; 
            inputValue: string | number 
        } 
      }
    | { type: "clear" };

    const formReducer = (state: Partial<User>, action: FormReducerAction): Partial<User> => {
        switch (action.type) {
            case "change_value":
                return {
                    ...state,
                    [action.payload.inputName]: action.payload.inputValue
                };
            case "clear":
                return getInitialData(user);
            default:
                return state;
        }
    };

    const [inputValues, dispatch] = useReducer(formReducer, getInitialData(user));

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (!inputValues.name || !inputValues.age || !inputValues.email) {
            alert('Please fill out all required fields.');
            return;
        }
        try {
            const changes = {...inputValues, password: inputValues.password ? inputValues.password : undefined}
            await editUser(user._id!, changes);
            onEditUser();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        dispatch({
            type: "change_value",
            payload: {
                inputName: name as keyof User,
                inputValue: name === 'age' || name === 'phone' ? Number(value) : value
            }
        });
    };
    

    return (
        <div className="editUser" onClick={event => event.stopPropagation()}>
            <h3>Edit User</h3>
            <form onSubmit={handleSubmit} className={formStyles.form}>
            <div className={formStyles.formGroup}>
                    <label htmlFor="name" className={formStyles.label}>Name</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.name}
                        type='text'
                        name="name"
                        id="name"
                        placeholder="Enter your name"
                        className={formStyles.input}
                        required
                    />
                </div>
                <div className={formStyles.formGroup}>
                    <label htmlFor="age" className={formStyles.label}>Age</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.age || ''}
                        type='number'
                        name="age"
                        id="age"
                        placeholder="Enter your age"
                        className={formStyles.input}
                        required
                        min="0"
                    />
                </div>
                <div className={formStyles.formGroup}>
                    <label htmlFor="email" className={formStyles.label}>Email</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.email}
                        type='email'
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        className={formStyles.input}
                        required
                    />
                </div>
                <div className={formStyles.formGroup}>
                    <label htmlFor="password" className={formStyles.label}>Password</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.password}
                        type='password'
                        name="password"
                        id="password"
                        placeholder="(unchanged)"
                        className={formStyles.input}
                    />
                </div>
                <div className={formStyles.buttonGroup}>
                    <button 
                        type="button" 
                        onClick={() => dispatch({ type: "clear" })} 
                        className={formStyles.button}
                    >
                        Clear
                    </button>
                    <button type="submit" className={formStyles.button}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}