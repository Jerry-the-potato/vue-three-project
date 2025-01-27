import _axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import qs from 'qs'
import { useNotification } from 'naive-ui'


const rootUrl = import.meta.env.VITE_BASE_API_URL
const tokenName = 'iaToken'

const axios = _axios.create({
	baseURL: `${rootUrl}`,
	// headers: {
	// 'Access-Control-Allow-Origin': '*',
	// 'Content-Type': 'application/json'
	// },
	// timeout: 30000
})

// Add a request interceptor
axios.interceptors.request.use(
	(config) => {
		// Do something before request is sent
		// console.log(config)
		return config
	},
	(error) => {
		// Do something with request error
		return Promise.reject(error)
	}
)

// Add a response interceptor
axios.interceptors.response.use(
	(response) => {
		// Do something with response data
		// console.log(response)
		return response
	},
	(error) => {
		// Do something with response error
		return Promise.reject(error)
	}
)

/**
 *
 * @param useToken 是否使用預設token，如果是無需使用token的api請設定false
 * @returns
 */
export default function (useToken: boolean = true) {
	// use -------------------
	const notification = useNotification()

	// function -------------------
	/** 共用 then */
	const thenHandler = (data: { success: boolean; message: string; data: any }) => {
		if (data.success) {
			return data.data
		} else if (data.success == null) {
			throw new Error('回傳不具有success值')
		} else {
			throw new Error(data.message)
		}
	}

	/** 共用 catch */
	const catchHandler = (error: AxiosError) => {
		// 這邊抓取真的httpCode
		const httpCode = error.response != null ? error.response.status : 200
		// 身份驗證錯誤
		if (httpCode === 200) {
			
		}
		// 200 但還是錯誤的話，用於首頁登入時的錯誤
		else if (httpCode === 403) {
			
		} else if (httpCode === 400 || httpCode === 500) {
			notification.error({
				title: '警告',
				content: '伺服器錯誤',
				duration: 3500,
				keepAliveOnHover: true,
			})
		}
		// 其他錯誤將錯誤訊息顯示
		else {
			notification.warning({
				title: '錯誤',
				content: error.message,
				duration: 3500,
				keepAliveOnHover: true,
			})
		}

		// console.log(error)
		throw error
	}

	/** headers 初始化 */
	const createHeaders = (token: string | null, contentType: string = 'application/json; charset=utf-8') => {
		const headers = { Authorization: '', 'Content-Type': contentType }

		// 是否使用預設token
		if (token) {
			headers.Authorization = `Bearer ${token}`
		} else if (useToken) {
			const defaultToken = Cookies.get(tokenName)
			if (defaultToken) {
				headers.Authorization = `Bearer ${defaultToken}`
			}
		}
		return headers
	}

	return {
		/**
		 * axios [Get]
		 * @param url api 網址
		 * @param requestData 傳入參數
		 * @param token 不傳入則使用預設token
		 * @param isUseErrorDialog 是否使用錯誤dialog
		 * @returns 回傳data
		 */
		Get: async (url: string, requestData: any = null, token: string | null = null, isUseErrorDialog: boolean = true) =>
			axios({
				method: 'GET',
				url: url,
				headers: createHeaders(token),
				params: requestData,
				paramsSerializer: function (params) {
					return qs.stringify(params, { arrayFormat: 'repeat' })
				},
			})
				.then(({ data }) => thenHandler(data))
				.catch((error) => {
					if (isUseErrorDialog) {
						throw catchHandler(error)
					}
					throw error
				}),
		/**
		 * axios [Post]
		 * @param url api 網址
		 * @param requestData 傳入參數
		 * @param token 不傳入則使用預設token
		 * @param isUseErrorDialog 是否使用錯誤dialog
		 * @returns 回傳data
		 */
		Post: async (url: string, requestData: any = null, token: string | null = null, isUseErrorDialog: boolean = true) =>
			axios({
				method: 'POST',
				url: url,
				data: requestData,
				headers: createHeaders(token),
			})
				.then(({ data }) => thenHandler(data))
				.catch((error) => {
					if (isUseErrorDialog) {
						throw catchHandler(error)
					}
					throw error
				}),
		/**
		 * axios [Put]
		 * @param url api 網址
		 * @param requestData 傳入參數
		 * @param token 不傳入則使用預設token
		 * @param isUseErrorDialog 是否使用錯誤dialog
		 * @returns 回傳data
		 */
		Put: async (url: string, requestData: any = null, token: string | null = null, isUseErrorDialog: boolean = true) =>
			axios({
				method: 'Put',
				url: url,
				data: requestData,
				headers: createHeaders(token),
			})
				.then(({ data }) => thenHandler(data))
				.catch((error) => {
					if (isUseErrorDialog) {
						throw catchHandler(error)
					}
					throw error
				}),
		/**
		 * axios [Delete]
		 * @param url api 網址
		 * @param requestData 傳入參數
		 * @param token 不傳入則使用預設token
		 * @param isUseErrorDialog 是否使用錯誤dialog
		 * @returns 回傳data
		 */
		Delete: async (
			url: string,
			paramData: any = null,
			requestData: any = null,
			token: string | null = null,
			isUseErrorDialog: boolean = true
		) =>
			axios({
				method: 'Delete',
				url: url,
				params: paramData,
				data: requestData,
				headers: createHeaders(token, 'application/json'),
				paramsSerializer: function (params) {
					return qs.stringify(params, { arrayFormat: 'repeat' })
				},
			})
				.then(({ data }) => thenHandler(data))
				.catch((error) => {
					if (isUseErrorDialog) {
						throw catchHandler(error)
					}
					throw error
				}),

	}
}
