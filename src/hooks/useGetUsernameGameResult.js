import {useMemo} from "react";

export const useGetUsernameGameResult = (gameMetadata, username) => {
    return useMemo(() => {
        if (!gameMetadata || !username) return null;
        if (!gameMetadata.result || !gameMetadata.white || !gameMetadata.black) return null;

        if (gameMetadata.white.toLowerCase() === username.toLowerCase()) {
            return gameMetadata.result === '1-0' ? 'win' : gameMetadata.result === '0-1' ? 'loss' : 'draw';
        } else if (gameMetadata.black.toLowerCase() === username.toLowerCase()) {
            return gameMetadata.result === '0-1' ? 'win' : gameMetadata.result === '1-0' ? 'loss' : 'draw';
        }
        return null;
    }, [gameMetadata.black, gameMetadata.result, gameMetadata.white, username]);
}