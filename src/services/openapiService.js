/* eslint-disable no-unused-vars */

import axios from "axios"
import _ from 'lodash'
import streamer from './streamer'

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

const getOpenapiService = () => {

    const accessToken = localStorage.getItem('accessToken')

    const subscriptions = {}

    const handleMessage = (newMessage) => {
        console.log("HandleMessage", newMessage, newMessage["payload"].length)
        let referenceId = newMessage.referenceId
        if (referenceId === "_heartbeat") {
            referenceId = newMessage["payload"][0]["Heartbeats"][0]["OriginatingReferenceId"]
            console.log("This message is a heartbeat: ", referenceId, newMessage["payload"][0]["Heartbeats"][0]["Reason"])
        } else {
            const handler = subscriptions[referenceId]
            handler.newMessage(newMessage)
        }

        //make sure to actually handle heartbeats...im skipping that

    }

    const subscriptionHandler = (initialSnapshot, callback, identifier) => {
        let snapshot = initialSnapshot

        callback(snapshot)

        const newMessage = function (newMessage) {
            snapshot = mergeMessageWithSnapshot(newMessage, snapshot, identifier)
            callback(snapshot)
        }

        return {
            newMessage
        }
    }

    const mergeMessageWithSnapshot = (message, snapshot, identifier) => {
        const payload = message.payload
        if (identifier === "ENS") {
            return message
        }
        if (Array.isArray(payload)) {
            // Loop over array items and merge
            payload.forEach(item => {
                // Handle deleted
                if (item.__meta_deleted) {
                    snapshot = snapshot.filter(snapshotItem => snapshotItem[identifier] !== item[identifier])
                } else {
                    // Handle new or updated
                    const index = snapshot.findIndex(snapshotItem => snapshotItem[identifier] === item[identifier])
                    if (index >= 0) {
                        // Update
                        snapshot[index] = _.merge(snapshot[index], item)
                    } else {
                        // Insert new
                        snapshot.push(item)
                    }
                }
            })
        } else {
            snapshot = _.merge(snapshot, payload)
        }
        return snapshot
    }

    const { createConnection,
        startListener } = streamer(handleMessage)

    const contextId = "FreddyTraderPro" + Date.now()

    // Create websocket connection
    createConnection(accessToken, contextId)
    startListener()

    const openapiService = () => {
        const environment = localStorage.getItem('environment')
        const accessToken = localStorage.getItem('accessToken')
        const app = apps[environment]
        const client = axios.create({
            baseURL: app.OpenApiBaseUrl,
            timeout: 5000,
            headers: { 'Authorization': `Bearer ${accessToken}` }
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
            accountDetails() {
                return client.get('/port/v1/accounts/me').then(result => result.data.Data)
            },
            searchInstrumentPrice(uic, assetType) {
                return client.get(`/trade/v1/infoprices/?Uic=${uic}&AssetType=${assetType}`).then(result => result.data)
            },
            placeMarketOrder(uic, assetType, BuyOrSell, amount, accountKey) {
                const request_object =
                {
                    "ManualOrder": true,
                    "AccountKey": accountKey,
                    "Amount": amount,
                    "AssetType": assetType,
                    "BuySell": BuyOrSell,
                    "OrderDuration": {
                        "DurationType": "DayOrder"
                    },
                    "OrderType": "Market",
                    "Uic": uic
                }
                return client.post(`trade/v2/orders`, request_object).then(result => result.data)
            },
            placeOrder(uic, assetType, BuyOrSell, MarketOrLimit, price, amount, accountKey) {
                var request_object =
                {
                    "ManualOrder": true,
                    "AccountKey": accountKey,
                    "Amount": amount,
                    "AssetType": assetType,
                    "BuySell": BuyOrSell,
                    "OrderDuration": {
                        "DurationType": "DayOrder"
                    },
                    "OrderType": "Market",
                    "Uic": uic
                }

                if (MarketOrLimit === "Limit") {
                    request_object.OrderDuration.DurationType = "GoodTillCancel"
                    request_object.OrderPrice = price
                    request_object.OrderType = MarketOrLimit
                    console.log(price)
                }

                return client.post(`trade/v2/orders`, request_object).then(result => result.data)
            },
            deleteOrder(orderId, accountKey) {
                return client.delete(`trade/v2/orders/` + orderId + "?AccountKey=" + accountKey).then(result => result.data)
            },
            async subscribeOrders(callback, clientKey) {
                const referenceId = "orders_ref_" + Date.now()
                const snapshot = await client.post('/port/v1/orders/subscriptions',
                    {
                        "Arguments": {
                            "ClientKey": clientKey,
                            "FieldGroups": ["DisplayAndFormat"]
                        },
                        "ContextId": contextId,
                        "ReferenceId": referenceId
                    }
                ).then(result => result.data.Snapshot.Data)
                subscriptions[referenceId] = subscriptionHandler(snapshot, callback, "OrderId")
            },
            async subscribeENS(callback) {
                const referenceId = "ens_ref_" + Date.now()
                const snapshot = await client.post('/ens/v1/activities/subscriptions',
                    {
                        "Arguments": {
                            "Activities": ["orders"]
                        },
                        "ContextId": contextId,
                        "ReferenceId": referenceId
                    }
                ).then(result => result.data.Snapshot.Data)
                subscriptions[referenceId] = subscriptionHandler(snapshot, callback, "ENS")
            }
        }
    }

    return {
        openapiService
    }
}



export default getOpenapiService
export {
    getAuthUrl,
    getLogoutUrl
}