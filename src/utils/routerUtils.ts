import { useRouter } from 'vue-router'

export default function () {
	const router = useRouter()
	return {
		setRouter: async function (id: string | null = null, url: string | null = null) {
			if (id != null && url != null) {
				await router.push({
					//   path: "/Editor/" + id + "/" + url,
					name: '/views/MainView',
					params: { id: id, url: url },
				})
			} else {
				await router.push({ path: '/Login/success' })
			}
		},
		backLogin: async function () {
			await router.push({ path: '/' })
		},
		backLogout: async function () {
			await router.push({ path: '/logout' })
		},
	}
}
