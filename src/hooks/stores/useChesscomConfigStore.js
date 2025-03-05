import {persist} from "zustand/middleware";
import {create} from "zustand";

export const useChesscomConfigStore = create(
    persist(
        (set, get) => ({
            chesscomUsername: '',
            autoRetrieveGames: true,

            setChesscomUsername: (username) => {
                set({chesscomUsername: username});
            },

            setAutoRetrieveGames: (value) => {
                set({autoRetrieveGames: value});
            }
        }),
        {
            name: 'chesscom-config-store'
        }
    )
)