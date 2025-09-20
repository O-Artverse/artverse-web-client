export const QUERY_KEYS = {
    posts: {
        all: () => ['posts'],
        detail: (id: number) => ['posts', id],
    },
    todo: {
        getTodos: () => ['todos'],
        addTodo: () => ['todos', 'add'],
    },
    user: {
        all: () => ['users'],
        current: () => [...QUERY_KEYS.user.all(), 'current'],
    },
    auth: {
        login: () => ['auth', 'login'],
        register: () => ['auth', 'register'],
    },
    artwork: {
        getArtwork: (id: string) => ['artwork', id],    
    },
};

export const queryKeys = {
  CHAT_ROOMS: 'chat-rooms',
  CHAT_MESSAGES: 'chat-messages',
  FAVORITE_ARTWORKS: 'favorite-artworks',
  SEARCH_USERS: 'search-users',
} as const;
