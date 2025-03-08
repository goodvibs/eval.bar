import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const ReactCompilerConfig = {
    target: '18' // '17' | '18' | '19'
}

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        plugins: [
            react({
                babel: {
                    plugins: [
                        ["babel-plugin-react-compiler", ReactCompilerConfig],
                    ],
                },
            }),
        ],
    };
});