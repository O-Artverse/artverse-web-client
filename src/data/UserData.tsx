export interface User {
    id: string
    name: string
    email: string
    roles?: string[]
    gender: string
}

export const userData: User = {
    id: 'abc',
    name: 'Nguyễn ABC',
    roles: ['admin'],
    email: 'example@example.com',
    gender: "male"
}
