import "../App.css";

import { useState } from "react";

import { useAuthContext } from "../hooks/useAuthContext";

import SoundsList from "../components/SoundsList";
import EditSoundForm from "../components/EditSoundForm";

import { Sound } from "../interfaces/Sound";

const Sounds = () => {
    const { user } = useAuthContext();
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
    const [updated, setUpdated] = useState(false);

    const handleEditClick = (e: React.MouseEvent, sound: Sound) => {
        e.preventDefault();
        setSelectedSound(sound);
        setShowEditPopup(true);
    };

    const handlePopupClose = () => {
        setSelectedSound(null);
        setShowEditPopup(false);
        setUpdated(!updated);
    };
    return (
        <>
            <h1 style={{ textAlign: "center" }}>Sounds</h1>
            <div className="container">
                <SoundsList
                    user={user}
                    isProfile={false}
                    loggedInUserId={user?.userId || ""}
                    username={user?.username || ""}
                    onEditClick={handleEditClick}
                    updatedSound={updated}
                />
                {showEditPopup && user && selectedSound && (
                    <div className="editPopupContainer">
                        <div className="editPopup">
                            <EditSoundForm
                                sound={selectedSound}
                                user={user}
                                onClose={handlePopupClose}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Sounds;
