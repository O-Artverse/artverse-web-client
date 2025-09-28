export interface User {
    id: string
    name?: string
    email: string
    username: string
    firstName?: string
    lastName?: string
    avatar?: string
    avatarPath?: string  // Added for avatar path compatibility
    role: 'ADMIN' | 'USER' | 'BUSINESS'
    businessType?: 'ARTIST' | 'ORGANIZATION' | null
    birthdate?: string  // Made optional to handle undefined cases
    description?: string
    bio?: string  // Added for bio compatibility
    city?: string  // Added for location display
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
