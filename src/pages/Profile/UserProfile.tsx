import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { environment } from "../../environment";
import "./styles.css";

import axios from "axios";
import SoundsList from "../../components/SoundsList";
import { User } from "../../interfaces/User";
import { useAuthContext } from "../../hooks/useAuthContext";

const UserProfile = () => {
    const { username } = useParams();
    const { user: authUser } = useAuthContext();

    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        if (username) {
            axios
                .get(`${environment.API_URL}/api/v1/user/${username}`)
                .then((res) => {
                    const { name, pfpUrl } = res.data;
                    let token;
                    if (authUser) {
                        token = authUser.token;
                    }
                    setUser({ ...res.data, token });
                })
                .catch((err) => console.error(err));
        } else if (authUser) {
            setUser(authUser);
        }
    }, [authUser, username]);
    return (
        <>
            <div className="main">
                <div className="half">
                    <h1>{user && `${user.username}'s Profile`}</h1>

                    <img src={user?.pfpUrl || ""} alt=">///<" />
                </div>
                <div className="half">
                    <h1 style={{ height: "1rem" }}>Sounds</h1>
                    <SoundsList user={user} />
                </div>
            </div>
        </>
    );
};

export default UserProfile;
