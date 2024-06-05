// 导入 pinia 插件并从中解构出 createPinia
import { createPinia } from 'pinia'
// // 导入pinia持久化插件
// import persist from 'pinia-plugin-persistedstate'
// const pinia = createPinia().use(persist)

// import { useCart } from './modules/cart'

const pinia = createPinia()

// pinia.registerModule('m_cart', useCart)

// import { useUserStore } from './modules/user'
// export { useUserStore }
// export { default as m_cart } from './modules/cart'

export default pinia

export * from './modules/cart'
export * from './modules/user'