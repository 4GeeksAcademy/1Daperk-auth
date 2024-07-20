import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import  useGlobalReducer  from "../hooks/useGlobalReducer";


const Private = () => {
    const { dispatch, store } = useGlobalReducer(); 
    const { theid } = useParams();
    const [bgColor, setBgColor] = useState("#000000");

    useEffect(() => {
        const getUserById = async () => {
            try {
                const response = await fetch(`https://didactic-acorn-r4766ggwwxrvc5g54-3001.app.github.dev//api/users/${theid}`);
                if (!response.ok) {
                    throw new Error('User not found');
                }
                const userData = await response.json();
                dispatch({ type: 'update_user', user: userData });
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        getUserById();

        const changeColor = () => {
            const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
            setBgColor(color);
        };

        const intervalId = setInterval(changeColor, 1000); // Change color every second

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [dispatch, theid]);

    return (
        <div className="private-view" style={{ backgroundColor: bgColor }}>
            <div className="content col-9">
                <h1 id="email_welcome">Welcome, {store.user ? store.user.email : "User"}</h1>
            </div>
        </div>
    );
};

export default Private;
