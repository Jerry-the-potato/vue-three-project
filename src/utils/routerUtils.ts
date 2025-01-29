import { useRouter } from 'vue-router'

export default function () {
	const router = useRouter()
	return {
		setRouter: async function (
			id: string | null = null,
			url: string | null = null,
			value: number | null = null,
		) {
			if (id != null && url != null && value!= null) {
				await router.push({
					// path = `/src/components/gallerys/${params.value.id}/${params.value.url}.vue`;
					name: '/views/MainView',
					params: { id: id, url: url },
					query: {value: value},
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
