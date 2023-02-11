import Player from "../components/Player";
import Stack from "@mui/material/Stack";

import { Sound } from "../interfaces/Sound";

const SoundsList = ({
    sounds,
    username,
}: {
    sounds: Sound[];
    username: string;
}) => {
    return (
        <Stack
            className="container"
            sx={{ width: "100%", maxWidth: 500, mt: "30px" }}
            spacing={2}
            direction="column-reverse"
            justifyContent="space-between"
        >
            {sounds &&
                sounds.map((sound, i) => {
                    return <Player key={i} sound={sound} username={username} />;
                })}
        </Stack>
    );
};

export default SoundsList;
