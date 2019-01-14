import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Home from './component/Home.js';
import NavBar from './component/NavBar.js'
import LoginPage from "./component/LoginPage.js"
import PostPage from "./component/PostPage.js"
import ShopPage from "./component/ShopPage.js"
import DeveloperPage from "./component/DeveloperPage.js"
import CartPage from "./component/CartPage.js"
import { decrypt } from "./component/Encrypt"
import AccountPage from "./component/AccountPage.js"
import DelieverPage from "./component/DelieverPage.js"
import PlatformABI from './platform_abi.js'
import Web3 from 'web3';
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';
// const ganache = require('dexon-ganache-cli');
const IPFS = require('ipfs-http-client')
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {
    constructor(props) {
        super(props);


        // init null dexon but not conntected
        window.dexon.enable()
        const dexonProvider = window.dexon
        this.web3 = new Web3(dexonProvider)
        // this.web3 = new Web3(new Web3.providers.HttpProvider("http://172.20.10.4:8545"))
        // this.web3 = new Web3(ganache.provider());
        this.platformABI = PlatformABI;
        this.state = {
            login: false,
            created: false,
            name: "",
            balance: 0,
            held_balance: 0,
            phone: '',
            salesReputation: 0,
            deliveryReputation: 0,
            platformAddress: '0xe061ccdefaa6d1ad4acaabffd57820e173f6eac1',
            platformContract: new this.web3.eth.Contract(this.platformABI, '0xe061ccdefaa6d1ad4acaabffd57820e173f6eac1'),
            items: [],
            dataBaseSize: 0,
            events: [],
            deliverList: []
        };
        this.getAccount()
        this.eventPost()
        this.eventUpdateItem(this.state.platformContract.events.eBuy)
        this.eventUpdateItem(this.state.platformContract.events.ePend)
        this.eventUpdateItem(this.state.platformContract.events.eConfirmDeliver)
        this.eventUpdateItem(this.state.platformContract.events.eConfirmTx)
        this.eventUpdateItem(this.state.platformContract.events.eRatingTx)
        // this.eventPend()
        // this.eventPend()
        // this.eventConfirmDeliver()
        // this.eventConfirmTx()
        // this.updateTime = 10000
    }
    eventPost = () => {
        this.state.platformContract.events.ePost((error, result) => {
            // console.log(result.returnValues.txId);

            console.log("Update Post event")
            const find = this.state.events.findIndex(id => result.id === id)
            if (find === -1) {
                this.setState({ events: [...this.state.events, result.id] })
                const txId = result.returnValues.txId
                this.state.platformContract.methods['txDatabase'](txId).call().then((tx) => {
                    // console.log(tx._hashDescription)
                    this.getIpfsData(tx._hashDescription).then((files) => {
                        this.state.platformContract.methods._userProfiles(tx._seller).call().then((user) => {
                            const avatar = user._name
                            // console.log(files[0])
                            const newItems = {
                                index: tx._txId,
                                productName: tx._name,
                                price: tx._value,
                                status: Number(tx._status),
                                imgBase64: files[0],
                                description: files[3],
                                city: files[1],
                                country: files[2],
                                sellerName: tx._seller,
                                deliverName: tx._driver,
                                buyerName: tx._buyer,
                                sellerNickName: avatar,
                                buyerNickName: '',
                                driverNickName: '',
                                postTime: files[4],
                                buyerCity: "",
                                buyerCountry: "",
                                buyerEncyrpted: "",
                            }
                            this.setState({ items: [...this.state.items, newItems] });
                            console.log
                        })
                    })
                    this.sleep(500)
                });
            }

        })
    }
    eventUpdateItem = (event) => {
        event((error, result) => {
            console.log("Update item event")
            const find = this.state.events.findIndex(id => result.id === id)
            if (find === -1) {
                this.setState({ events: [...this.state.events, result.id] })
                const txId = result.returnValues.txId
                this.updateItem(txId)
            }
        })
    }
    // eventBuy = () => {
    //     this.state.platformContract.events.eBuy((error, result) => {
    //         console.log(result.returnValues.tx_id);
    //         const txId = result.returnValues.tx_id
    //         this.updateItem(txId)
    //     })
    // }
    // eventPend = () => {
    //     this.state.platformContract.events.ePend((error, result) => {
    //         console.log(result);
    //         const txId = result.returnValues.txId
    //         this.state.platformContract.methods['txDatabase'](txId).call().then((tx) => {
    //             this.getIpfsData(tx._hashBuyerInfo)
    //             .then((files) => {
    //                 this.handleGetInfo(txId, files[2])
    //             })
    //         })
    //     })
    // }
    // eventConfirmDeliver = () => {
    //     this.state.platformContract.events.ePend((error, result) => {
    //         console.log(result.returnValues.tx_id);
    //         const txId = result.returnValues.tx_id
    //         this.updateItem(txId)
    //     })
    // }
    // eventConfirmTx = () => {
    //     this.state.platformContract.events.ePend((error, result) => {
    //         console.log(result.returnValues._tx_id);
    //         const txId = result.returnValues._tx_id
    //         this.updateItem(txId)
    //     })
    // }
    updateItem = (txId) => {
        const itemIndex = this.state.items.findIndex(item => item.index === txId)
        const newItems = [...this.state.items];
        // console.log(tx._hashDescription)
        // let tx;
        // this.state.platformContract.methods['txDatabase'](txId).call().then((tx) => {
        //     tx = tx
        //     if(Number(tx._status === 0)) {
        //         var promise_1 = this.getIpfsData(tx._hashDescription)
        //         var promise_2 = this.state.platformContract.methods.getTxAllName(tx._seller, tx._buyer, tx._driver).call()
        //         return Promise.all([promise_1, promise_2])
        //     } else {
        //         var promise_1 = this.getIpfsData(tx._hashDescription)
        //         var promise_2 = this.state.platformContract.methods.getTxAllName(tx._seller, tx._buyer, tx._driver).call()
        //         var promise_3 = this.getIpfsData(tx._hashBuyerInfo)
        //         return Promise.all([promise_1, promise_2, promise_3])
        //     }
        // }).then((values) => {
        //     const files = values[0]
        //     const name = values[1]
        //     if(values.length === 2) {
        //         const files = values[0]
        //         const name = values[1]
        //         newItems[itemIndex] = {
        //             index: tx._txId,
        //             productName: tx._name,
        //             price: tx._value,
        //             status: Number(tx._status),
        //             imgBase64: files[0],
        //             description: files[3],
        //             city: files[1],
        //             country: files[2],
        //             sellerName: tx._seller,
        //             deliverName: tx._driver,
        //             buyerName: tx._buyer,
        //             sellerNickName: name[0],
        //             buyerNickName: name[1],
        //             driverNickName: name[2],
        //             postTime: files[4],
        //             buyerCity: '',
        //             buyerCountry: "",
        //             buyerEncyrpted: "",
        //         }
        //     } else {
        //         const buyerFiles = values[3]
        //         newItems[itemIndex] = {
        //             index: tx._txId,
        //             productName: tx._name,
        //             price: tx._value,
        //             status: Number(tx._status),
        //             imgBase64: files[0],
        //             description: files[3],
        //             city: files[1],
        //             country: files[2],
        //             sellerName: tx._seller,
        //             deliverName: tx._driver,
        //             buyerName: tx._buyer,
        //             sellerNickName: name[0],
        //             buyerNickName: name[1],
        //             driverNickName: name[2],
        //             postTime: files[4],
        //             buyerCity: buyerFiles[0],
        //             buyerCountry: buyerFiles[1],
        //             buyerEncyrpted: buyerFiles[2],
        //         };
        //     } 
        //     this.setState({ items: newItems });
        //     console.log("update item done")
        // })
        // this.sleep(100)

        this.state.platformContract.methods['txDatabase'](txId).call().then((tx) => {
            this.getIpfsData(tx._hashDescription).then((files) => {
                this.state.platformContract.methods.getTxAllName(tx._seller, tx._buyer, tx._driver).call().then((name) => {
                    console.log(name)
                    if (Number(tx._satus) === 0) {
                        newItems[itemIndex] = {
                            index: tx._txId,
                            productName: tx._name,
                            price: tx._value,
                            status: Number(tx._status),
                            imgBase64: files[0],
                            description: files[3],
                            city: files[1],
                            country: files[2],
                            sellerName: tx._seller,
                            deliverName: tx._driver,
                            buyerName: tx._buyer,
                            sellerNickName: name[0],
                            buyerNickName: name[1],
                            driverNickName: name[2],
                            postTime: files[4],
                            buyerCity: '',
                            buyerCountry: "",
                            buyerEncyrpted: "",
                        };
                        this.setState({ items: newItems });
                    } else {
                        this.getIpfsData(tx._hashBuyerInfo).then((buyerFiles) => {
                            newItems[itemIndex] = {
                                index: tx._txId,
                                productName: tx._name,
                                price: tx._value,
                                status: Number(tx._status),
                                imgBase64: files[0],
                                description: files[3],
                                city: files[1],
                                country: files[2],
                                sellerName: tx._seller,
                                deliverName: tx._driver,
                                buyerName: tx._buyer,
                                sellerNickName: name[0],
                                buyerNickName: name[1],
                                driverNickName: name[2],
                                postTime: files[4],
                                buyerCity: buyerFiles[0],
                                buyerCountry: buyerFiles[1],
                                buyerEncyrpted: buyerFiles[2],
                            };
                            this.setState({ items: newItems });
                        })
                        console.log("update item done")
                    }

                })
            })
            this.sleep(300)
        })
    }

    checkRoot = () => {
        return this.dexonAccount === '0x9b4bB121C6aA94481EDd92d2177deEaf620b76eA'
    }

    updateContract = (address) => {
        // connect with dexon wallet
        if (this.checkRoot) {
            this.setState({
                platformAddress: address,
            });
            this.setState({
                platformContract: new this.web3.eth.Contract(this.platformABI, address)
            });
        } else {
            // console.log("You are not root")
        }
    }
    getAccount = () => {
        var promise = new Promise((resolve, reject) => {
            // console.log("getAccount")
            if (this.dexonAccount === undefined) {
                this.web3.eth.getAccounts().then(accounts => {
                    this.dexonAccount = accounts[0]
                    if (this.dexonAccount === "0x9b4bB121C6aA94481EDd92d2177deEaf620b76eA") {
                        // console.log("root mode")
                    }
                    resolve(this.dexonAccount)
                }).catch(error => console.log(error));
            } else {
                resolve("Promise resolved successfully");
            }
        }
        )
        return promise
    }
    getIpfsData = (hash) => {

        var promise = new Promise((resolve, reject) => {
            // console.log("getAccount")
            ipfs.cat(hash, (err, file) => {
                if (file) {
                    const string = file.toString()
                    resolve(string.split("\\"))
                }
                reject("Null file")
            })

        })
        return promise
    }
    componentDidMount = () => {
        this.update()
        // setInterval(() => {this.update()}, this.updateTime)
    }

    newItem = (index, productName, price, status, imgBase64, description, city, country, sellerName, deliverName, buyerName, sellerNickName, buyerNickName, driverNickName, postTime, buyerCity, buyerCountry, buyerEncyrpted) => {
        return {
            index: index,
            productName: productName,
            price: price,
            status: status,
            imgBase64: imgBase64,
            description: description,
            city: city,
            country: country,
            sellerName: sellerName,
            deliverName: deliverName,
            buyerName: buyerName,
            sellerNickName: sellerNickName,
            buyerNickName: buyerNickName,
            driverNickName: driverNickName,
            postTime: postTime,
            buyerCity: buyerCity,
            buyerCountry: buyerCountry,
            buyerEncyrpted: buyerEncyrpted,
        };
    }
    update = () => {
        // this.state.platformContract.methods.txDatabaseSize().call().then((txSize) => {
        //     for (let i = 0; i < txSize; ++i) {
        //         let tx;
                
        //         this.state.platformContract.methods['txDatabase'](i).call().then((tx_tmp) => {
        //             tx = tx_tmp
        //             console.log("Loading Tx " + tx._txId)
        //             if(Number(tx_tmp._status === 0)) {
        //                 var promise_1 = this.getIpfsData(tx_tmp._hashDescription)
        //                 var promise_2 = this.state.platformContract.methods.getTxAllName(tx_tmp._seller, tx_tmp._buyer, tx_tmp._driver).call()
        //                 return Promise.all([promise_1, promise_2])
        //             } else {
        //                 var promise_1 = this.getIpfsData(tx_tmp._hashDescription)
        //                 var promise_2 = this.state.platformContract.methods.getTxAllName(tx_tmp._seller, tx_tmp._buyer, tx_tmp._driver).call()
        //                 var promise_3 = this.getIpfsData(tx_tmp._hashBuyerInfo)
        //                 return Promise.all([promise_1, promise_2, promise_3])
        //             }
        //         }).then((values) => {
        //             const files = values[0]
        //             const name = values[1]
        //             let newItem;
        //             if(values.length === 2) {
        //                 console.log(tx)
        //                 const files = values[0]
        //                 const name = values[1]
        //                 newItem = {
        //                     index: tx._txId,
        //                     productName: tx._name,
        //                     price: tx._value,
        //                     status: Number(tx._status),
        //                     imgBase64: files[0],
        //                     description: files[3],
        //                     city: files[1],
        //                     country: files[2],
        //                     sellerName: tx._seller,
        //                     deliverName: tx._driver,
        //                     buyerName: tx._buyer,
        //                     sellerNickName: name[0],
        //                     buyerNickName: name[1],
        //                     driverNickName: name[2],
        //                     postTime: files[4],
        //                     buyerCity: '',
        //                     buyerCountry: "",
        //                     buyerEncyrpted: "",
        //                 }
        //             } else {
        //                 console.log(tx)
        //                 const buyerFiles = values[3]
        //                 newItem = {
        //                     index: tx._txId,
        //                     productName: tx._name,
        //                     price: tx._value,
        //                     status: Number(tx._status),
        //                     imgBase64: files[0],
        //                     description: files[3],
        //                     city: files[1],
        //                     country: files[2],
        //                     sellerName: tx._seller,
        //                     deliverName: tx._driver,
        //                     buyerName: tx._buyer,
        //                     sellerNickName: name[0],
        //                     buyerNickName: name[1],
        //                     driverNickName: name[2],
        //                     postTime: files[4],
        //                     buyerCity: buyerFiles[0],
        //                     buyerCountry: buyerFiles[1],
        //                     buyerEncyrpted: buyerFiles[2],
        //                 };
        //             } 
        //             this.setState({ items: [...this.state.items, newItem] });
        //             console.log("update item done")
        //         })
        //         this.sleep(100)
        //     }
        // })
        this.state.platformContract.methods.txDatabaseSize().call().then((txSize) => {
            this.setState({ dataBaseSize: txSize })
            for (let i = 0; i < txSize; ++i) {
                this.state.platformContract.methods['txDatabase'](i).call().then((tx) => {
                    console.log("Loading")

                    this.getIpfsData(tx._hashDescription)
                        .then((files) => {
                            this.state.platformContract.methods.getTxAllName(tx._seller, tx._buyer, tx._driver).call().then((name) => {
                                // console.log(name)
                                // console.log(tx._hashBuyerInfo)
                                if (Number(tx._status) === 0) {
                                    const newItem = this.newItem(tx._txId, tx._name, tx._value, Number(tx._status), files[0], files[3], files[1], files[2], tx._seller, tx._driver, tx._buyer, name[0], name[1], name[2], files[4], "", "", "")
                                    this.setState({ items: [...this.state.items, newItem] });
                                    console.log(tx)
                                    console.log("Set State status 0")
                                } else {
                                    this.getIpfsData(tx._hashBuyerInfo).then((buyerFiles) => {
                                        const newItem = this.newItem(tx._txId, tx._name, tx._value, Number(tx._status), files[0], files[3], files[1], files[2], tx._seller, tx._driver, tx._buyer, name[0], name[1], name[2], files[4], buyerFiles[0], buyerFiles[1], buyerFiles[2])
                                        this.setState({ items: [...this.state.items, newItem] });
                                        console.log(tx)
                                        console.log("Set State status > 0")
                                        // if(this.dexonAccount === tx._driver || this.dexonAccount === tx._seller || this.dexonAccount === tx._buyer) {
                                        //     this.handleGetInfo(tx._txId, buyerFiles[2])
                                        // }
                                    })
                                }

                            })
                        })
                    this.sleep(100)
                }).catch(error => console.log(error));
            }
        }).catch(error => console.log(error));
        this.handleListProfile();
    }
    sleep = (milliseconds) => {
        var start = new Date().getTime();
        while (1)
            if ((new Date().getTime() - start) > milliseconds)
                break;
    }
    handleLogin = (e) => {
        this.setState({
            login: e.login
        });
    }


    handleLogout = () => {
        this.setState({
            login: false
        });
    }
    hadnleGetName = (address) => {
        this.state.platformContract.methods['txDatabase'](address).call().then((user) => {
            console.log(user._name)
        }).catch(error => console.log(error));
    }

    handleCreateUser = (phone, name, created) => {
        this.handleLogin({ login: true });
        if (!created) {
            this.handleLogin({ login: true });
            var createUser = this.state.platformContract.methods['createUser'](phone, name)
            this.state.platformContract.methods['guaranteedDeposit']().call()
                .then((value) => {
                    createUser.send({ from: this.dexonAccount, value: value })
                        .then(() => {
                            console.log("login Success")
                            this.handleLogin({ login: true });
                        })
                }).catch(error => console.log(error));
        }
    }

    handleEditName = (name) => {
        var editUserName = this.state.platformContract.methods['editUserName'](name)
        editUserName.send({ from: this.dexonAccount })
            .then(() => {
                console.log("setName")
                this.setState({
                    name: name
                })
            })
    }

    handleListProfile = () => {
        this.getAccount()
            .then((result) => {
                var listProfile = this.state.platformContract.methods['listProfile'](this.dexonAccount)
                listProfile.call()
                    .then((response) => {
                        // console.log("list")
                        // console.log(response)
                        this.setState({
                            name: response[0],
                            balance: response[1],
                            held_balance: response[2],
                            phone: response[5],
                            salesReputation: response[3],
                            deliveryReputation: response[4]
                        })
                    }).catch(error => console.log(error));
            }
            ).catch(error => console.log(error));
    }

    handlePost = (productName, price, ipfsHash) => {
        console.log("Post " + ipfsHash)
        var post = this.state.platformContract.methods['post'](productName, price, ipfsHash)
        post.send({ from: this.dexonAccount })
    }

    handleBuy = (txId, pKey, hash) => {
        console.log("Buy " + txId)
        var buy = this.state.platformContract.methods['buy'](txId, pKey, hash)
        buy.send({ from: this.dexonAccount })
    }

    handleTakeMission = (txId) => {
        console.log("Deliver " + txId)
        var pend = this.state.platformContract.methods['pend'](txId)
        pend.send({ from: this.dexonAccount })
    }

    handleConfirmDeliever = (txId) => {
        console.log("Confirm Deliver " + txId)
        var confirmDeliever = this.state.platformContract.methods['confirmDeliver'](txId)
        confirmDeliever.send({ from: this.dexonAccount })
    }

    handleConfirmTx = (txId) => {
        console.log("Confirm Tx " + txId)
        var confirmTx = this.state.platformContract.methods['confirmTx'](txId)
        confirmTx.send({ from: this.dexonAccount })
    }

    handleRatingTx = (txId, sellerScore, driverSocre) => {
        console.log("Rating " + txId)
        var ratingTx = this.state.platformContract.methods['ratingTx'](txId, sellerScore, driverSocre)
        ratingTx.send({ from: this.dexonAccount })
    }

    sponsor = (account, value) => {
        this.state.platformContract.methods['sponsor'](account, value).send({ from: this.dexonAccount })
    }

    getUserInfo = (txId) => {
        return new Promise((resolve, reject) => {
            console.log("App page Get Info")
            var sellerInfo = this.state.platformContract.methods['getSellerInfo'](txId)
            var buyerInfo = this.state.platformContract.methods['getBuyerInfo'](txId)
            buyerInfo.call()
                .then((response) => {
                    const hash = response[0]
                    // console.log("APP Get Buyer Info Success")
                    this.getIpfsData(hash)
                        .then((files) => {
                            const file = files[2]
                            const pKey = response[1]
                            // console.log(response)
                            // console.log(file)
                            sellerInfo.call()
                                .then((response1) => {
                                    console.log("Get Seller Info Success")
                                    // console.log(response1)
                                    const sellerPhone = response1
                                    const buyerDecryptedInfo = decrypt(file, pKey).split("\\")
                                    resolve(buyerDecryptedInfo[0] + "//" + buyerDecryptedInfo[1] + "//" + sellerPhone)
                                })
                        })
                    // this.sleep(100)

                })
        })

    }



    getReputation = (account) => {
        return new Promise((resolve, reject) => {
            this.state.platformContract.methods.getReputation(account)
                .call()
                .then((response) => {
                    console.log("getReputation")
                    resolve(response)
                })
        })
    }
    render() {
        const MyHomePage = (props) => {
            return (
                <div>
                    <Home login={this.state.login}
                        items={this.state.items.reduce((itemList, item) => {
                            if (item.status !== 0) {
                                return itemList
                            } else {
                                itemList.push(item)
                                return itemList
                            }
                        }, [])}
                        getReputation={this.getReputation}
                        hadnleGetName={this.hadnleGetName}
                        handleBuy={this.handleBuy} />
                </div>
            );
        }
        const MyDeveloperPage = (props) => {
            return (
                <DeveloperPage account={this.dexonAccount} updateContract={this.updateContract} sponsor={this.sponsor} currentAddress={this.state.platformAddress} />
            )
        };
        const MyNavBar = (props) => {
            return (
                <NavBar login={this.state.login} handleLogout={this.handleLogout} />
            )
        };
        const MyLoginPage = (props) => {
            return (
                <LoginPage handleCreateUser={this.handleCreateUser} userName={this.state.name} />
            )
        };
        const MyPostPage = (props) => {
            return (
                <PostPage handlePost={this.handlePost} />
            )
        }
        const MyShopPage = (props) => {
            return (
                <ShopPage id={props.match.params.id} items={this.state.items} handleBuy={this.handleBuy} />
            )
        }
        const MyAccountPage = (props) => {
            return (
                <AccountPage userInfo={{
                    name: this.state.name,
                    balance: this.state.balance,
                    held_balance: this.state.held_balance,
                    phone: this.state.phone,
                    salesReputation: this.state.salesReputation,
                    deliveryReputation: this.state.deliveryReputation,
                }}
                    handleEditName={this.handleEditName} handleListProfile={this.handleListProfile} />
            )
        }
        const MyDelieverPage = (props) => {
            return (
                <div>
                    <DelieverPage login={this.state.login} items={this.state.items} handleTakeMission={this.handleTakeMission} hadnleGetName={this.hadnleGetName} />
                </div>
            )
        }

        const MyCartPage = (props) => {
            return (
                <div>
                    <CartPage handleRatingTx={this.handleRatingTx} getUserInfo={this.getUserInfo} handleConfirmDeliever={this.handleConfirmDeliever} handleConfirmTx={this.handleConfirmTx} login={this.state.login} items={this.state.items} handleGetName={this.handleGetName} dexonAccount={this.dexonAccount} />
                </div>
            )
        }
        return (
            <BrowserRouter>
                <div>
                    <Route path='/' render={MyNavBar} />
                    <Route exact path='/' render={MyHomePage} />
                    <Route path='/developer' render={MyDeveloperPage} />
                    <Route path="/login" render={MyLoginPage} />
                    <Route path="/post" render={MyPostPage} />
                    <Route path="/shop/:id" render={MyShopPage} />
                    <Route path="/account" render={MyAccountPage} />
                    <Route path="/deliver" render={MyDelieverPage} />
                    <Route path="/cart" render={MyCartPage} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
