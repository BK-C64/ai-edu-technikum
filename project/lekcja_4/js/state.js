// Plik na "fałszywe" dane aplikacji (stan)

const appState = {
    servers: [
        { id: 's1', name: 'Serwer Gamingowy', icon: '🎮' },
        { id: 's2', name: 'Nauka Programowania', icon: '💻' },
        { id: 's3', name: 'Dyskusje o Filmach', icon: '🎬' }
    ],
    channels: {
        s1: [
            { id: 'c1', name: 'ogólny' },
            { id: 'c2', name: 'valorant' },
            { id: 'c3', name: 'minecraft' }
        ],
        s2: [
            { id: 'c4', name: 'javascript' },
            { id: 'c5', name: 'python' }
        ],
        s3: [
            { id: 'c6', name: 'nowości-kinowe' }
        ]
    },
    users: {
        s1: [
            { id: 'u1', name: 'Adam' },
            { id: 'u2', name: 'Ewa' },
            { id: 'u3', name: 'Karol' }
        ],
        s2: [
            { id: 'u1', name: 'Adam' },
            { id: 'u4', name: 'Ola' }
        ],
        s3: [
            { id: 'u2', name: 'Ewa' }
        ]
    },
    messages: {
        c1: [
            { userId: 'u1', text: 'Hej wszystkim!' },
            { userId: 'u2', text: 'Cześć! Ktoś chętny na grę?' }
        ],
        c2: [
            { userId: 'u3', text: 'Szukam kogoś do rankeda.' }
        ],
        c4: [
            { userId: 'u4', text: 'Jak zrobić pętlę w pętli?' },
            { userId: 'u1', text: 'Pokaż kod, to pomożemy.' }
        ]
    },
    currentUser: { id: 'u1', name: 'Adam' },
    activeServer: 's1',
    activeChannel: 'c1'
};
