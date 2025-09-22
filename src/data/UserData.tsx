export interface User {
    id: string
    name?: string
    email: string
    username: string
    firstName?: string
    lastName?: string
    avatar?: string
    role: 'ADMIN' | 'USER' | 'BUSINESS'
    businessType?: 'ARTIST' | 'ORGANIZATION' | null
    birthdate: string
    description?: string
    website?: string
    instagram?: string
    facebook?: string
    twitter?: string
    createdAt?: string
    ownedOrganizations?: Array<{
        id: string
        name: string
        description?: string
    }>
    // Legacy fields
    roles?: string[]
    gender?: string
}

export const userData: User = {
    id: 'abc',
    name: 'Nguyễn ABC',
    username: 'nguyenabc',
    email: 'example@example.com',
    role: 'USER',
    birthdate: '1990-01-01',
    // Legacy
    roles: ['admin'],
    gender: "male"
}
