import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { toast } from "react-hot-toast";

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);

const Register = () => {

    const { store, actions } = useContext(Context);
    const [image, setImage] = useState(null);
    const [user, setUser] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const registerUser = async (user) => {
        if (user.password !== user.passwordConfirm) {
            toast.error("Passwords do not match");
            return;
        }
        await actions.register(user.email, user.fullName, user.password, user.profileImageUrl);
        navigate("/");
    }

    const uploadImage = async (image) => {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${image.name}`);

        const metadata = {
            contentType: image.type
        };

        const uploadTask = uploadBytesResumable(storageRef, image, metadata);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                toast.error("Error uploading image");
                console.error(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setUser({
                        ...user,
                        profileImageUrl: downloadURL,
                        image: null
                    });
                });
            });

    }

    useEffect(() => {
        if (store.token) {
            navigate("/");
        }
    }, []);

    return (
        <div className="mx-auto my-auto flex flex-col">
            <h1 className="text-center">Register</h1>
            <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" className="form-control" onChange={(event) => setUser({
                    ...user,
                    email: event.target.value
                })} />
            </div>
            <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="email" className="form-control" onChange={(event) => setUser({
                    ...user,
                    fullName: event.target.value
                })} />
            </div>
            <div className="mb-3 d-flex flex-column">
                <label className="form-label">Profile Image</label>
                {
                    user.image && <img src={URL.createObjectURL(user.image)} width="100" height="100" className="img-fluid" />
                }
                {
                    user.image && (
                        <button className="btn btn-success"
                            onClick={() => uploadImage(user.image)}
                        >
                            Upload Image
                        </button>)
                }
                {
                    user.profileImageUrl && <img src={user.profileImageUrl} width="100" height="100" className="img-fluid" />
                }
                <input type="file" accept="image/*" className="form-control" onChange={(event) => setUser({
                    ...user,
                    image: event.target.files[0]
                })} />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="d-flex">
                    <input type={showPassword ? "text" : "password"} className="form-control" onChange={(event) => setUser({
                        ...user,
                        password: event.target.value
                    })} />
                    <button className="btn btn-success"
                        onClick={() => setShowPassword(!showPassword)}
                    >{showPassword ? "🔒" : "👀"}</button>
                </div>
                <label className="form-label">Confirm Password</label>
                <div className="d-flex">
                    <input type={showPassword ? "text" : "password"} className="form-control" onChange={(event) => setUser({
                        ...user,
                        passwordConfirm: event.target.value
                    })} />
                    <button className="btn btn-success"
                        onClick={() => setShowPassword(!showPassword)}
                    >{showPassword ? "🔒" : "👀"}</button>
                </div>
            </div>
            <button onClick={() => registerUser(user)}
                className="btn btn-success w-100 mt-2">Register</button>
        </div>
    );
};

export default Register;