// src/data/ArtData.ts
export type Category = 'Realism' | 'Impressionism' | 'Abstract' | 'Nature' | 'Cityscapes';

export type Art = {
    id: number;
    title: string;
    author: string;
    category: Category;
    image: string;
    likes: number;
    views: number;
    description: string;
    ratio: number;       // height/width
    createdAt: string;
};

export type Comment = {
    id: string;
    artId: number;
    user: { id: string; name: string; avatar?: string };
    content: string;
    createdAt: string;
    parentId?: string;
};

// ---------- Mock data ----------
const CATS: Category[] = ['Realism', 'Impressionism', 'Abstract', 'Nature', 'Cityscapes'];
const img = (id: number, w = 1000, ratio = 1.2) => {
    const h = Math.max(400, Math.round(w * ratio));
    return `https://picsum.photos/id/${id}/${w}/${h}.jpg?q=70&v=${id}`;
};

const mockArts: Art[] = Array.from({ length: 80 }).map((_, i) => {
    const id = i + 1;
    const ratio = 0.75 + ((id % 7) * 0.12);
    return {
        id,
        title: `Artwork #${id}`,
        author: ['Van G.', 'Claude', 'Hayao', 'Mucha', 'Hokusai', 'Remy'][id % 6],
        category: CATS[id % CATS.length],
        image: img(50 + id, 1200, ratio),
        likes: 40 + ((id * 37) % 420),
        views: 500 + ((id * 91) % 3200),
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam torquent maximus porta dictum metus vel maecenas amet ac mauris commodo tempus justo hendrerit nostra. Habitant litora pharetra platea massa senectus. Et imperdiet vitae purus et tortor malesuada condimentum. Rutrum torquent orci accumsan nunc lacinia tempus sodales varius lorem conubia elementum dapibus neque.',
        ratio,
        createdAt: new Date(Date.now() - id * 86400000).toISOString(),
    };
});

let mockComments: Comment[] = [
    { id: 'c1', artId: 1, user: { id: 'u1', name: 'Cole G. Smith' }, content: 'Tuyệt vời!', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'c2', artId: 1, user: { id: 'u2', name: 'Jacob' }, content: 'Màu quá đẹp.', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'c3', artId: 1, user: { id: 'u1', name: 'Cole G. Smith' }, content: 'I love this.', createdAt: new Date(Date.now() - 3600 * 1000).toISOString(), parentId: 'c2' },
];

// ---------- “API” giả ----------
export async function listArts(params?: { category?: Category | 'All'; take?: number; skip?: number }) {
    const { category = 'All', take = 30, skip = 0 } = params ?? {};
    const src = category === 'All' ? mockArts : mockArts.filter(a => a.category === category);
    return src.slice(skip, skip + take);
}

export async function getArt(id: number) {
    return mockArts.find(a => a.id === id) || null;
}

export async function getRelated(id: number, take = 10) {
    const art = await getArt(id);
    if (!art) return [];
    const pool = mockArts.filter(a => a.category === art.category && a.id !== id);
    return pool.slice(0, take);
}

export async function listComments(artId: number) {
    return mockComments.filter(c => c.artId === artId);
}

export async function addComment(artId: number, content: string) {
    const c: Comment = {
        id: Math.random().toString(36).slice(2),
        artId,
        user: { id: 'me', name: 'You' },
        content,
        createdAt: new Date().toISOString(),
    };
    mockComments = [c, ...mockComments];
    return c;
}
