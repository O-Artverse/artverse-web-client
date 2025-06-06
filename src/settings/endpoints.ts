const prefixBase: string = '/api'

const authEndpoint = {
    SIGN_IN: '/auth/login',
    SIGN_UP: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgotPassword',
    REFRESH_TOKEN: '/auth/refreshToken',
}
const userEndpoint = {
    CHANGE_PASSWORD: `${prefixBase}/auth/changePassword`,
    VERIFY_USER: (token: string) => `${prefixBase}/auth/verify/${token}`,
    GET_MY_USER: `${prefixBase}/users/me`,
    REGISTER_LESSOR: `${prefixBase}/users/become-owner`,
}
const productEndpoint = {
    GET_ALL: `${prefixBase}/product`,
    GET_ALL_APPROVED: `${prefixBase}/product/approved`,
    GET_BY_ID: (id: string) => `${prefixBase}/product/${id}`,
    CREATE: `${prefixBase}/product`,
    GET_BY_IDSHOP: (id: string) => `${prefixBase}/product/store/${id}`,
}

const storeEndpoint = {
    GET_ALL: `${prefixBase}/shopDetail`,
    GET_BY_ID: (id: string) => `${prefixBase}/shopDetail/${id}`,
    CREATE: `${prefixBase}/shopDetail`,
    GET_MY_SHOP: `${prefixBase}/shopDetail/me`,
    UPDATE_PACKAGE: `${prefixBase}/shopDetail/packages`,
    UPDATE_CONFIRM: `${prefixBase}/shopDetail/skipConfirm`,
}
const categoryEndpoint = {
    GET_ALL: `${prefixBase}/category`,
}
const productReviewEndpoint = {
    GET_ALL: `${prefixBase}/productReview`,
    GET_BY_ID_PRODUCT: (id: string) =>
        `${prefixBase}/productReview/product/${id}`,
    CREATE: `${prefixBase}/shopDetail`,
}
const cloudinaryEndpoint = {
    UPLOAD: `${prefixBase}/cloudinary`,
}
const orderEndpoint = {
    GET_ORDER_BY_UNIT_ID: (unitId: string) =>
        `${prefixBase}/order-products/unit/${unitId}`,
    GET_ORDER_BY_PRODUCT_ID: `${prefixBase}/order-products/byProductIds`,
    CREATE_ORDER: `${prefixBase}/orders/create-payment-url`,
    RETURN_ORDER: `${prefixBase}/orders/vnpay-return`,
    POST_ORDER: `${prefixBase}/orders`,
    CHECK_ORDER: `${prefixBase}/orders/check`,
    GET_ORDER_BY_USER_ID: `${prefixBase}/orders/user/:userId`,
    UPDATE_STATUS: `${prefixBase}/orders/:id/status`,
    GET_ORDER_BY_RENTER_ID: `${prefixBase}/orders/renter/:renterId`,
    GET_ORDER_BY_ID: (id: string) => `${prefixBase}/orders/${id}`,
    ORDER_EVIDENCE: `${prefixBase}/order-evidence`,
    GET_ORDER_EVIDENCE_BY_ORDERID: (id: string) => `${prefixBase}/order-evidence/order/${id}`,

}

export const chatEndpoint = {
    GET_ROOMS: () => '/api/chatrooms',
    CREATE_ROOM: () => '/api/chatrooms',
    GET_MESSAGES: (roomId: string) => `/api/chatrooms/${roomId}/messages`,
    POST_MESSAGE: (roomId: string) => `/api/chatrooms/${roomId}/messages`,
    GET_SHOP_ROOMS: (shopId: string) => `/api/chatrooms/shop/${shopId}`,
}

export {
    authEndpoint,
    userEndpoint,
    productEndpoint,
    storeEndpoint,
    productReviewEndpoint,
    categoryEndpoint,
    cloudinaryEndpoint,
    orderEndpoint,
}
