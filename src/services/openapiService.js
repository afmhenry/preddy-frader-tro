/* eslint-disable no-unused-vars */

import axios from "axios"
import _ from 'lodash'
import streamer from './streamer'

const apps = {
    sim: {
        "AppName": "Saxo Trader Dev",
        "AppKey": "8607589a93f5404a9f0b3d25e64842d6",
        "AuthorizationEndpoint": "https://sim.logonvalidation.net/authorize",
        "TokenEndpoint": "https://sim.logonvalidation.net/token",
        "LogoutEndpoint": "https://sim.logonvalidation.net/oidclogout",
        "OpenApiBaseUrl": "https://gateway.saxobank.com/sim/openapi",
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
        //for each new message, print.
        let referenceId = newMessage.referenceId
        if (referenceId === "_heartbeat") {
            referenceId = newMessage["payload"][0]["Heartbeats"][0]["OriginatingReferenceId"]
            //todo: somehow manifest heartbeats in the UI, maybe per ref?
            console.log("Heartbeat for refId: ", referenceId, newMessage["payload"][0]["Heartbeats"][0]["Reason"])

            //lets process this anyway. 
            newMessage = newMessage["payload"][0]

        } else {
            console.log("Message for refId", referenceId, newMessage)

        }
        const handler = subscriptions[referenceId]
        handler.newMessage(newMessage)

    }

    const subscriptionHandler = (initialSnapshot, callback, identifier) => {
        let snapshot = initialSnapshot

        callback(snapshot)

        const newMessage = function (newMessage) {

            // if we want to catch the heartbeats, 
            // we can return an identical snapshot, 
            // and add this parameter to the callback 
            if (newMessage["Heartbeats"]) {
                callback(snapshot, "heartbeat")
            } else {
                snapshot = mergeMessageWithSnapshot(newMessage, snapshot, identifier)
                callback(snapshot)
            }
        }

        return {
            newMessage
        }
    }

    const mergeMessageWithSnapshot = (message, snapshot, identifier) => {
        const payload = message.payload
        if (identifier === "ENS") {
            //ENS provides full message of new events, so no merge neede
            snapshot.push(message)
        } else if (Array.isArray(payload)) {
            // Loop over array items and merge
            payload.forEach(item => {
                // Handle deleted based on provided identifier
                if (item.__meta_deleted) {
                    snapshot = snapshot.filter(snapshotItem => snapshotItem[identifier] !== item[identifier])
                } else {
                    // Handle new or updated
                    const index = snapshot.findIndex(snapshotItem => snapshotItem[identifier] === item[identifier])
                    if (index >= 0) {
                        // Update existing entry in array
                        snapshot[index] = _.merge(snapshot[index], item)
                    } else {
                        // Insert new item, since it doesnt exist
                        snapshot.push(item)
                    }
                }
            })
        } else {
            //not an array, simply merge
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

    const reauthorizeStreaming = () => {
        const environment = localStorage.getItem('environment')
        const accessToken = localStorage.getItem('accessToken')
        const app = apps[environment]

        axios.put(`${app.OpenApiBaseUrl}/streamingws/authorize?contextId=${contextId}`, {}, {
            headers: { 'Authorization': `Bearer ${accessToken}` }

        })
    }

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
            getInstrumentChart(uic, assetType) {
                return client.get(`/chart/v1/charts?Uic=${uic}&AssetType=${assetType}&Count=50&FieldGroups=Data&Horizon=10080`).then(result => result.data)
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
                    request_object["OrderDuration"]["DurationType"] = "GoodTillCancel"
                    request_object["OrderPrice"] = price
                    request_object["OrderType"] = MarketOrLimit
                }

                return client.post(`/trade/v2/orders`, request_object).then(result => result.data)
            },
            deleteOrder(orderId, accountKey) {
                return client.delete(`/trade/v2/orders/` + orderId + "?AccountKey=" + accountKey).then(result => result.data)
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
            async subscribePositions(callback, clientKey) {
                const referenceId = "positions_ref_" + Date.now()
                const snapshot = await client.post('/port/v1/positions/subscriptions',
                    {
                        "Arguments": {
                            "ClientKey": clientKey,
                            "FieldGroups": ["DisplayAndFormat", "PositionBase"]
                        },
                        "ContextId": contextId,
                        "ReferenceId": referenceId
                    }
                ).then(result => result.data.Snapshot.Data)

                //not tested
                subscriptions[referenceId] = subscriptionHandler(snapshot, callback, "PositionId")
            },
            async subscribeBalances(callback, clientKey) {
                const referenceId = "balances_ref_" + Date.now()
                const snapshot = await client.post('/port/v1/balances/subscriptions',
                    {
                        "Arguments": {
                            "ClientKey": clientKey,
                            "FieldGroups": ["CalculateCashForTrading"]
                        },
                        "ContextId": contextId,
                        "ReferenceId": referenceId
                    }
                ).then(result => result.data.Snapshot)
                subscriptions[referenceId] = subscriptionHandler(snapshot, callback, "Balances")
            },
            async subscribeENS(callback) {
                const referenceId = "ens_ref_" + Date.now()
                const snapshot = await client.post('/ens/v1/activities/subscriptions',
                    {
                        "Arguments": {
                            "Activities": ["Orders", "Positions"]
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
        openapiService,
        reauthorizeStreaming
    }
}

export default getOpenapiService

export {
    getAuthUrl,
    getLogoutUrl
}