import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { User } from "../../interfaces/User";
import { useAuthContext } from "../../hooks/useAuthContext";
import { environment } from "../../environment";

import SoundsList from "../../components/SoundsList";

import axios from "axios";
import "./styles.css";

const UserProfile = () => {
    const { username } = useParams();
    const { user: authUser } = useAuthContext();

    const [user, setUser] = useState<User | null>(null);
    const [hasSounds, setHasSounds] = useState(false);

    if (!(username || authUser)) {
        return <div>no profile</div>;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${environment.API_URL}/api/v1/user/${username}`
                );
                let token;
                if (authUser) {
                    token = authUser.token;
                }
                setUser(authUser ? { ...res.data, token } : res.data);
                setHasSounds(res.data.hasSounds);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [authUser, username]);

    return (
        <>
            <div className="main">
                <div className="half">
                    <h1>{`${user?.username}'s Profile`}</h1>

                    <img src={user?.pfpUrl || ""} alt=">///<" />
                </div>
                <div className="half">
                    {hasSounds ? (
                        <h1 style={{ height: "1rem" }}>Sounds</h1>
                    ) : (
                        <h1 style={{ height: "1rem" }}>No Sounds</h1>
                    )}
                    {user && (
                        <SoundsList
                            user={user}
                            isProfile={true}
                            loggedInUserId={authUser?.userId || ""}
                            username={username || ""}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default UserProfile;
