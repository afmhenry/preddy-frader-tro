import axios from "axios"

const apps = {
    sim: {
        AppKey: "698b5ebc5f5c4ef0a2de3b59655e187a",
        AuthorizationEndpoint: "https://sim.logonvalidation.net/authorize",
        TokenEndpoint: "https://sim.logonvalidation.net/token",
        LogoutEndpoint: "https://sim.logonvalidation.net/oidclogout",
        OpenApiBaseUrl: "https://gateway.saxobank.com/sim/openapi",
    },
    live: {

    }
}

const getAuthUrl = (environment, state = "initial") => {
    const app = apps[environment]
    return `${app.AuthorizationEndpoint}?client_id=${app.AppKey}&response_type=token&state=${state}&redirect_uri=${window.location.href}`
}

const getLogoutUrl = (environment) => {
    const app = apps[environment]
    return app.LogoutEndpoint
}

const openapiService = () => {
    const environment = localStorage.getItem('environment')
    const app = apps[environment]
    const client = axios.create({
        baseURL: app.OpenApiBaseUrl,
        timeout: 5000,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });

    return {
        searchInstrument(keyword) {
            return client.get(`/ref/v1/instruments?Keywords=${keyword}&AssetTypes=FxSpot,Stock`).then(result => result.data.Data)
        },
        instrumentDetails(uic, assetType) {
            return client.get(`/ref/v1/instruments/details/${uic}/${assetType}?FieldGroups=TradingSessions`).then(result => result.data)
        },
        currentClientDetails() {
            return client.get('/port/v1/clients/me').then(result => result.data)
        },
        searchInstrumentPrice(uic, assetType) {
            return client.get(`/trade/v1/infoprices/?Uic=${uic}&AssetType=${assetType}`).then(result => result.data)
        }
    }
}

export default openapiService
export {
    getAuthUrl,
    getLogoutUrl
}