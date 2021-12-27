System.register("dev_card/dev_card", [], function (exports_1, context_1) {
    "use strict";
    var DevCard, devCardStr;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            (function (DevCard) {
                DevCard[DevCard["Knight"] = 0] = "Knight";
                DevCard[DevCard["VictoryPoint"] = 1] = "VictoryPoint";
                DevCard[DevCard["YearOfPlenty"] = 2] = "YearOfPlenty";
                DevCard[DevCard["Monopoly"] = 3] = "Monopoly";
                DevCard[DevCard["RoadBuilder"] = 4] = "RoadBuilder";
            })(DevCard || (DevCard = {}));
            exports_1("DevCard", DevCard);
            exports_1("devCardStr", devCardStr = (c) => {
                switch (c) {
                    case DevCard.Knight:
                        return 'knight';
                    case DevCard.VictoryPoint:
                        return 'victory point';
                    case DevCard.YearOfPlenty:
                        return 'yop';
                    case DevCard.Monopoly:
                        return 'monopoly';
                    default:
                        return 'road builder';
                }
            });
            exports_1("default", DevCard);
        }
    };
});
System.register("resource/resource", [], function (exports_2, context_2) {
    "use strict";
    var Resource, resStr;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            (function (Resource) {
                Resource[Resource["Brick"] = 0] = "Brick";
                Resource[Resource["Lumber"] = 1] = "Lumber";
                Resource[Resource["Ore"] = 2] = "Ore";
                Resource[Resource["Grain"] = 3] = "Grain";
                Resource[Resource["Wool"] = 4] = "Wool";
                Resource[Resource["None"] = 5] = "None";
            })(Resource || (Resource = {}));
            exports_2("Resource", Resource);
            exports_2("resStr", resStr = (res) => {
                switch (res) {
                    case Resource.Brick:
                        return 'brick';
                    case Resource.Lumber:
                        return 'lumber';
                    case Resource.Ore:
                        return 'ore';
                    case Resource.Grain:
                        return 'grain';
                    case Resource.Wool:
                        return 'wool';
                    default:
                        return 'none';
                }
            });
            exports_2("default", Resource);
        }
    };
});
System.register("constants", [], function (exports_3, context_3) {
    "use strict";
    var NUM_RESOURCE_TYPES, NUM_EACH_RESOURCE_TILE, NUM_DEV_CARD_TYPES, NUM_PLAYERS, NUM_SETTLEMENTS, NUM_CITIES, NUM_ROADS, NUM_EACH_RESOURCE, NUM_VPS, NUM_KNIGHTS, NUM_ROAD_BUILDING, NUM_YEAR_OF_PLENTY, NUM_MONOPOLY, RES_PER_SETTLEMENT, RES_PER_CITY, MIN_LONGEST_ROAD, MIN_LARGEST_ARMY, BANK_RATE, VPS_TO_WIN, ROBBER_LIMIT, NUM_NODES, NUM_EDGES, NUM_TILES, HAVE_PORTS;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            exports_3("NUM_RESOURCE_TYPES", NUM_RESOURCE_TYPES = 5);
            exports_3("NUM_EACH_RESOURCE_TILE", NUM_EACH_RESOURCE_TILE = [3, 4, 3, 4, 4]);
            exports_3("NUM_DEV_CARD_TYPES", NUM_DEV_CARD_TYPES = 5);
            exports_3("NUM_PLAYERS", NUM_PLAYERS = 4);
            exports_3("NUM_SETTLEMENTS", NUM_SETTLEMENTS = 5);
            exports_3("NUM_CITIES", NUM_CITIES = 4);
            exports_3("NUM_ROADS", NUM_ROADS = 15);
            exports_3("NUM_EACH_RESOURCE", NUM_EACH_RESOURCE = 19);
            exports_3("NUM_VPS", NUM_VPS = 5);
            exports_3("NUM_KNIGHTS", NUM_KNIGHTS = 14);
            exports_3("NUM_ROAD_BUILDING", NUM_ROAD_BUILDING = 2);
            exports_3("NUM_YEAR_OF_PLENTY", NUM_YEAR_OF_PLENTY = 2);
            exports_3("NUM_MONOPOLY", NUM_MONOPOLY = 2);
            exports_3("RES_PER_SETTLEMENT", RES_PER_SETTLEMENT = 1);
            exports_3("RES_PER_CITY", RES_PER_CITY = 2);
            exports_3("MIN_LONGEST_ROAD", MIN_LONGEST_ROAD = 5);
            exports_3("MIN_LARGEST_ARMY", MIN_LARGEST_ARMY = 3);
            exports_3("BANK_RATE", BANK_RATE = 4);
            exports_3("VPS_TO_WIN", VPS_TO_WIN = 10);
            exports_3("ROBBER_LIMIT", ROBBER_LIMIT = 7);
            exports_3("NUM_NODES", NUM_NODES = 54);
            exports_3("NUM_EDGES", NUM_EDGES = 72);
            exports_3("NUM_TILES", NUM_TILES = 19);
            exports_3("HAVE_PORTS", HAVE_PORTS = [
                [0, 1],
                [3, 4],
                [7, 17],
                [14, 15],
                [26, 37],
                [28, 38],
                [45, 46],
                [47, 48],
                [50, 51],
            ]);
        }
    };
});
System.register("board/graph", [], function (exports_4, context_4) {
    "use strict";
    var Graph;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            Graph = class Graph {
                constructor(...args) {
                    this.keyOf = (v) => this.keys.get(v);
                    this.hasNode = (v) => this.keys.has(v);
                    this.hasEdge = (u, v) => {
                        if (!this.hasNode(u))
                            return false;
                        for (let i = 0; i < this.al[this.keyOf(u)].length; i++) {
                            if (this.al[this.keyOf(u)][i][0] === v)
                                return true;
                        }
                        return false;
                    };
                    this.degree = (u) => (this.hasNode(u) ? this.al[this.keyOf(u)].length : 0);
                    this.children = (u) => {
                        const children = [];
                        for (let i = 0; i < this.al[this.keyOf(u)].length; i++) {
                            children.push(this.al[this.keyOf(u)][i][0]);
                        }
                        return children;
                    };
                    this.nodeCount = () => this.al.length;
                    this.nodes = () => [...this.keys.keys()];
                    this.edgeCount = () => {
                        let count = 0;
                        const keys = [...this.keys.keys()];
                        for (let i = 0; i < keys.length; i++)
                            count += this.degree(keys[i]);
                        return Math.floor(count / 2);
                    };
                    this.al = [];
                    this.keys = new Map();
                    if (Array.isArray(args[0][0])) {
                        const edges = args[0];
                        for (let i = 0; i < edges.length; i++) {
                            const [u, v] = edges[i];
                            if (u === v)
                                continue;
                            if (this.hasNode(u)) {
                                this.al[this.keyOf(u)].push([v, -1]);
                            }
                            else {
                                this.keys.set(u, this.al.length);
                                this.al.push([[v, -1]]);
                            }
                            if (this.hasNode(v)) {
                                this.al[this.keyOf(v)].push([u, -1]);
                            }
                            else {
                                this.keys.set(v, this.al.length);
                                this.al.push([[u, -1]]);
                            }
                        }
                    }
                    else {
                        const nodes = args[0];
                        for (let i = 0; i < nodes.length; i++) {
                            if (this.hasNode(nodes[i]))
                                continue;
                            this.keys.set(nodes[i], this.al.length);
                            this.al.push([]);
                        }
                    }
                }
                addEdge(u, v, w = -1) {
                    if (!this.hasNode(u) || !this.hasNode(v) || this.hasEdge(u, v))
                        return;
                    this.al[this.keyOf(u)].push([v, w]);
                    this.al[this.keyOf(v)].push([u, w]);
                }
                deleteEdge(u, v) {
                    if (!this.hasNode(u) || !this.hasNode(v) || !this.hasEdge(u, v))
                        return;
                    this.al[this.keyOf(u)].splice(this.al[this.keyOf(u)].findIndex(([o]) => o === v), 1);
                    this.al[this.keyOf(v)].splice(this.al[this.keyOf(v)].findIndex(([o]) => o === u), 1);
                }
                getWeight(u, v) {
                    if (!this.hasEdge(u, v))
                        return -1;
                    const li = this.al[this.keyOf(u)];
                    for (let i = 0; i < li.length; i++) {
                        if (li[i][0] === v)
                            return li[i][1];
                    }
                    return -1;
                }
                setWeight(u, v, w) {
                    if (!this.hasEdge(u, v))
                        return;
                    let li = this.al[this.keyOf(u)];
                    li[li.findIndex(([o]) => o === v)][1] = w;
                    li = this.al[this.keyOf(v)];
                    li[li.findIndex(([o]) => o === u)][1] = w;
                }
            };
            exports_4("Graph", Graph);
            exports_4("default", Graph);
        }
    };
});
System.register("utils", ["board/graph"], function (exports_5, context_5) {
    "use strict";
    var graph_1, weightedRandom, rollDie, uniformRandom, maxTrail, connectedComponents, breadthFirstSearch;
    var __moduleName = context_5 && context_5.id;
    function maxTrailRec(v, g, seen) {
        const choices = g.children(v).filter((other) => !seen.hasEdge(v, other));
        if (choices.length === 0)
            return 0;
        let u, ret;
        u = choices[0];
        seen.addEdge(u, v);
        ret = 1 + maxTrailRec(u, g, seen);
        seen.deleteEdge(u, v);
        if (choices.length === 2) {
            u = choices[1];
            seen.addEdge(u, v);
            ret = Math.max(ret, 1 + maxTrailRec(u, g, seen));
            seen.deleteEdge(u, v);
        }
        return ret;
    }
    exports_5("maxTrailRec", maxTrailRec);
    return {
        setters: [
            function (graph_1_1) {
                graph_1 = graph_1_1;
            }
        ],
        execute: function () {
            exports_5("weightedRandom", weightedRandom = (weights) => {
                const sum = weights.reduce((acc, curr) => acc + curr);
                let value = Math.random() * sum;
                for (let i = 0; i < weights.length; i++) {
                    value -= weights[i];
                    if (value <= 0)
                        return i;
                }
                return -1;
            });
            exports_5("rollDie", rollDie = () => uniformRandom(1, 6));
            exports_5("uniformRandom", uniformRandom = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo);
            exports_5("maxTrail", maxTrail = (g, src) => {
                const seen = new graph_1.default(g.nodes());
                return maxTrailRec(src, g, seen);
            });
            exports_5("connectedComponents", connectedComponents = (g) => {
                let remaining = g.nodes();
                const ccs = [];
                while (remaining.length > 0) {
                    const src = remaining[0];
                    const { visited } = breadthFirstSearch(g, src);
                    const li = [...visited];
                    const cc = new graph_1.default(li);
                    for (let i = 0; i < li.length; i++) {
                        for (let j = i + 1; j < li.length; j++) {
                            if (g.hasEdge(li[i], li[j]))
                                cc.addEdge(li[i], li[j]);
                        }
                    }
                    ccs.push(cc);
                    remaining = remaining.filter((elt) => !visited.has(elt));
                }
                return ccs;
            });
            exports_5("breadthFirstSearch", breadthFirstSearch = (g, src) => {
                const queue = [src];
                const visited = new Set([src]);
                const depths = new Map();
                depths.set(src, 0);
                while (queue.length > 0) {
                    const curr = queue.pop();
                    const children = g.children(curr);
                    for (let i = 0; i < children.length; i++) {
                        const child = children[i];
                        if (visited.has(child))
                            continue;
                        queue.unshift(child);
                        visited.add(child);
                        depths.set(child, depths.get(curr) + 1);
                    }
                }
                return {
                    visited,
                    depth: Math.max(...depths.values()),
                };
            });
        }
    };
});
System.register("loggable", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("resource/resource_bundle", ["resource/resource", "constants", "utils"], function (exports_7, context_7) {
    "use strict";
    var resource_1, constants_1, utils_1, ResourceBundle;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (resource_1_1) {
                resource_1 = resource_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            ResourceBundle = class ResourceBundle {
                constructor(...args) {
                    this.toLog = () => this.bundle.map((amnt, i) => `${resource_1.resStr(i)}: ${amnt}`).join(', ');
                    if (args.length === 0) {
                        this.bundle = [...Array(constants_1.NUM_RESOURCE_TYPES)].map(() => 0);
                    }
                    else if (typeof args[0] === 'number') {
                        const [amnt] = args;
                        this.bundle = [...Array(constants_1.NUM_RESOURCE_TYPES)].map(() => amnt);
                    }
                    else {
                        const [amnts] = args;
                        this.bundle = [...Array(constants_1.NUM_RESOURCE_TYPES)];
                        for (let i = 0; i < constants_1.NUM_RESOURCE_TYPES; i++)
                            this.bundle[i] = amnts[i];
                    }
                }
                has(bundle) {
                    for (let i = 0; i < constants_1.NUM_RESOURCE_TYPES; i++) {
                        if (this.bundle[i] < bundle.get(i))
                            return false;
                    }
                    return true;
                }
                get(resource) {
                    return this.bundle[resource];
                }
                set(resource, amnt) {
                    this.bundle[resource] = amnt;
                }
                add(...args) {
                    if (args.length === 1) {
                        const [bundle] = args;
                        for (let i = 0; i < constants_1.NUM_RESOURCE_TYPES; i++) {
                            this.bundle[i] += bundle.get(i);
                        }
                    }
                    else {
                        const [resource, amnt] = args;
                        this.bundle[resource] += amnt;
                    }
                }
                subtract(...args) {
                    if (args.length === 1) {
                        const [bundle] = args;
                        for (let i = 0; i < constants_1.NUM_RESOURCE_TYPES; i++) {
                            this.bundle[i] -= bundle.get(i);
                        }
                    }
                    else {
                        const [resource, amnt] = args;
                        this.add(resource, -1 * amnt);
                    }
                }
                static trade(fromOffereeBundle, offereeBundle, fromOffererBundle, offererBundle) {
                    offereeBundle.add(fromOffererBundle);
                    offererBundle.subtract(fromOffererBundle);
                    offererBundle.add(fromOffereeBundle);
                    offereeBundle.subtract(fromOffereeBundle);
                }
                removeAll(resource) {
                    const temp = this.bundle[resource];
                    this.bundle[resource] = 0;
                    return temp;
                }
                removeOneAtRandom() {
                    const resToRemove = utils_1.weightedRandom(this.bundle);
                    this.bundle[resToRemove]--;
                    return resToRemove;
                }
                size() {
                    return this.bundle.reduce((acc, curr) => acc + curr);
                }
                isEmpty() {
                    return this.size() === 0;
                }
            };
            exports_7("ResourceBundle", ResourceBundle);
            ResourceBundle.roadCost = new ResourceBundle([1, 1, 0, 0, 0]);
            ResourceBundle.settlementCost = new ResourceBundle([1, 1, 0, 1, 1]);
            ResourceBundle.cityCost = new ResourceBundle([0, 0, 3, 2, 0]);
            ResourceBundle.devCardCost = new ResourceBundle([0, 0, 1, 1, 1]);
            exports_7("default", ResourceBundle);
        }
    };
});
System.register("trade_offer", ["constants"], function (exports_8, context_8) {
    "use strict";
    var constants_2, TradeStatus, TradeOffer;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (constants_2_1) {
                constants_2 = constants_2_1;
            }
        ],
        execute: function () {
            (function (TradeStatus) {
                TradeStatus[TradeStatus["Pending"] = 0] = "Pending";
                TradeStatus[TradeStatus["Accept"] = 1] = "Accept";
                TradeStatus[TradeStatus["Decline"] = 2] = "Decline";
            })(TradeStatus || (TradeStatus = {}));
            exports_8("TradeStatus", TradeStatus);
            TradeOffer = class TradeOffer {
                constructor(id, offerer, offer, request) {
                    this.allDeclined = () => this.status.filter((e) => e === TradeStatus.Decline).length === constants_2.NUM_PLAYERS - 1;
                    this.toLog = () => `{\nid: ${this.id}, offerer: ${this.offerer}\nstatus: ${this.status
                        .map((elt) => {
                        if (elt === TradeStatus.Accept)
                            return 'Accept';
                        else if (elt === TradeStatus.Decline)
                            return 'Decline';
                        return 'Pending';
                    })
                        .join(', ')}\noffer: [ ${this.offer.toLog()} ] request: [ ${this.request.toLog()} ]\n}`;
                    this.id = id;
                    this.offerer = offerer;
                    this.offer = offer;
                    this.request = request;
                    this.status = [...Array(constants_2.NUM_PLAYERS)].map(() => TradeStatus.Pending);
                    this.status[offerer] = TradeStatus.Accept;
                }
            };
            exports_8("TradeOffer", TradeOffer);
            exports_8("default", TradeOffer);
        }
    };
});
System.register("action", [], function (exports_9, context_9) {
    "use strict";
    var ActionType, actionTypeStr, Action;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            (function (ActionType) {
                ActionType[ActionType["Roll"] = 0] = "Roll";
                ActionType[ActionType["PlayRobber"] = 1] = "PlayRobber";
                ActionType[ActionType["MoveRobber"] = 2] = "MoveRobber";
                ActionType[ActionType["Rob"] = 3] = "Rob";
                ActionType[ActionType["PlayMonopoly"] = 4] = "PlayMonopoly";
                ActionType[ActionType["SelectMonopolyResource"] = 5] = "SelectMonopolyResource";
                ActionType[ActionType["PlayYearOfPlenty"] = 6] = "PlayYearOfPlenty";
                ActionType[ActionType["SelectYearOfPlentyResources"] = 7] = "SelectYearOfPlentyResources";
                ActionType[ActionType["PlayRoadBuilder"] = 8] = "PlayRoadBuilder";
                ActionType[ActionType["BuildSettlement"] = 9] = "BuildSettlement";
                ActionType[ActionType["BuildCity"] = 10] = "BuildCity";
                ActionType[ActionType["BuildRoad"] = 11] = "BuildRoad";
                ActionType[ActionType["Discard"] = 12] = "Discard";
                ActionType[ActionType["MakeTradeOffer"] = 13] = "MakeTradeOffer";
                ActionType[ActionType["DecideOnTradeOffer"] = 14] = "DecideOnTradeOffer";
                ActionType[ActionType["DrawDevCard"] = 15] = "DrawDevCard";
                ActionType[ActionType["Exchange"] = 16] = "Exchange";
                ActionType[ActionType["EndTurn"] = 17] = "EndTurn";
            })(ActionType || (ActionType = {}));
            exports_9("ActionType", ActionType);
            exports_9("actionTypeStr", actionTypeStr = (a) => {
                switch (a) {
                    case ActionType.Roll:
                        return 'Roll';
                    case ActionType.PlayRobber:
                        return 'Play Robber';
                    case ActionType.MoveRobber:
                        return 'Move Robber';
                    case ActionType.Rob:
                        return 'Rob';
                    case ActionType.PlayMonopoly:
                        return 'Play Monopoly';
                    case ActionType.SelectMonopolyResource:
                        return 'Select Monopoly Resource';
                    case ActionType.PlayYearOfPlenty:
                        return 'Play YOP';
                    case ActionType.SelectYearOfPlentyResources:
                        return 'Select YOP Resources';
                    case ActionType.PlayRoadBuilder:
                        return 'Play Road Builder';
                    case ActionType.BuildSettlement:
                        return 'Build Settlement';
                    case ActionType.BuildCity:
                        return 'Build City';
                    case ActionType.BuildRoad:
                        return 'Build Road';
                    case ActionType.Discard:
                        return 'Discard';
                    case ActionType.MakeTradeOffer:
                        return 'Make Trade Offer';
                    case ActionType.DecideOnTradeOffer:
                        return 'Decide on Trade Offer';
                    case ActionType.DrawDevCard:
                        return 'Draw Dev Card';
                    case ActionType.Exchange:
                        return 'Exchange';
                    default:
                        return 'End Turn';
                }
            });
            Action = class Action {
                constructor(type, player = 0, payload = {}) {
                    this.serialized = () => JSON.stringify(this);
                    this.type = type;
                    this.player = player;
                    this.payload = payload;
                }
            };
            exports_9("Action", Action);
            Action.deserialize = (serializedObj) => {
                const { type, payload, player } = JSON.parse(serializedObj);
                return new Action(type, player, payload);
            };
            exports_9("default", Action);
        }
    };
});
System.register("dev_card/dev_card_bundle", ["dev_card/dev_card", "constants", "utils"], function (exports_10, context_10) {
    "use strict";
    var dev_card_1, constants_3, utils_2, DevCardBundle;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (dev_card_1_1) {
                dev_card_1 = dev_card_1_1;
            },
            function (constants_3_1) {
                constants_3 = constants_3_1;
            },
            function (utils_2_1) {
                utils_2 = utils_2_1;
            }
        ],
        execute: function () {
            DevCardBundle = class DevCardBundle {
                constructor(...args) {
                    this.toLog = () => this.bundle.map((amnt, i) => `${dev_card_1.devCardStr(i)}: ${amnt}`).join(', ');
                    if (args.length === 0) {
                        this.bundle = [...Array(constants_3.NUM_DEV_CARD_TYPES)].map(() => 0);
                    }
                    else if (typeof args[0] === 'number') {
                        const [amnt] = args;
                        this.bundle = [...Array(constants_3.NUM_DEV_CARD_TYPES)].map(() => amnt);
                    }
                    else {
                        const [amnts] = args;
                        this.bundle = [...Array(constants_3.NUM_DEV_CARD_TYPES)];
                        for (let i = 0; i < constants_3.NUM_DEV_CARD_TYPES; i++)
                            this.bundle[i] = amnts[i];
                    }
                }
                add(devcard) {
                    this.bundle[devcard]++;
                }
                remove(devcard) {
                    this.bundle[devcard]--;
                }
                has(devcard) {
                    return this.bundle[devcard] !== 0;
                }
                pickOneAtRandom() {
                    return utils_2.weightedRandom(this.bundle);
                }
                size() {
                    return this.bundle.reduce((acc, curr) => acc + curr);
                }
                isEmpty() {
                    return this.size() === 0;
                }
            };
            exports_10("DevCardBundle", DevCardBundle);
            exports_10("default", DevCardBundle);
        }
    };
});
System.register("player", ["constants", "dev_card/dev_card_bundle", "resource/resource_bundle"], function (exports_11, context_11) {
    "use strict";
    var constants_4, dev_card_bundle_1, resource_bundle_1, Player;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (constants_4_1) {
                constants_4 = constants_4_1;
            },
            function (dev_card_bundle_1_1) {
                dev_card_bundle_1 = dev_card_bundle_1_1;
            },
            function (resource_bundle_1_1) {
                resource_bundle_1 = resource_bundle_1_1;
            }
        ],
        execute: function () {
            Player = class Player {
                constructor() {
                    this.toLog = () => `resources: [ ${this.resources.toLog()} ], devCards: [ ${this.devCards.toLog()} ], vps: ${this.victoryPoints} cities: ${this.cities} settlements: ${this.settlements} roads: ${this.roads}`;
                    this.resources = new resource_bundle_1.default();
                    this.rates = new resource_bundle_1.default(constants_4.BANK_RATE);
                    this.devCards = new dev_card_bundle_1.default();
                    this.knightsPlayed = 0;
                    this.victoryPoints = 0;
                    this.cities = constants_4.NUM_CITIES;
                    this.settlements = constants_4.NUM_SETTLEMENTS;
                    this.roads = constants_4.NUM_ROADS;
                }
            };
            exports_11("Player", Player);
            exports_11("default", Player);
        }
    };
});
System.register("turn_fsm", ["action"], function (exports_12, context_12) {
    "use strict";
    var action_1, TurnState, isValidTransition;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (action_1_1) {
                action_1 = action_1_1;
            }
        ],
        execute: function () {
            (function (TurnState) {
                TurnState["SetupSettlement"] = "Setup Settlement";
                TurnState["SetupRoad"] = "Setup Road";
                TurnState["Preroll"] = "Pre-roll";
                TurnState["Postroll"] = "Post-roll";
                TurnState["MovingRobber"] = "Moving Robber";
                TurnState["Robbing"] = "Robbing";
                TurnState["SelectingMonopolyResource"] = "Selecting Monopoly Resource";
                TurnState["SelectingYearOfPlentyResources"] = "Selecting Year of Plenty Resource";
                TurnState["Discarding"] = "Discarding";
            })(TurnState || (TurnState = {}));
            exports_12("TurnState", TurnState);
            exports_12("isValidTransition", isValidTransition = (state, action) => {
                const validActions = (() => {
                    switch (state) {
                        case TurnState.SetupSettlement:
                            return [action_1.ActionType.BuildSettlement];
                        case TurnState.SetupRoad:
                            return [action_1.ActionType.BuildRoad];
                        case TurnState.Preroll:
                            return [
                                action_1.ActionType.PlayMonopoly,
                                action_1.ActionType.PlayRobber,
                                action_1.ActionType.PlayYearOfPlenty,
                                action_1.ActionType.PlayRoadBuilder,
                                action_1.ActionType.Roll,
                            ];
                        case TurnState.MovingRobber:
                            return [action_1.ActionType.MoveRobber];
                        case TurnState.Robbing:
                            return [action_1.ActionType.Rob];
                        case TurnState.SelectingMonopolyResource:
                            return [action_1.ActionType.SelectMonopolyResource];
                        case TurnState.SelectingYearOfPlentyResources:
                            return [action_1.ActionType.SelectYearOfPlentyResources];
                        case TurnState.Discarding:
                            return [action_1.ActionType.Discard];
                        default:
                            return [
                                action_1.ActionType.MakeTradeOffer,
                                action_1.ActionType.DecideOnTradeOffer,
                                action_1.ActionType.Exchange,
                                action_1.ActionType.PlayMonopoly,
                                action_1.ActionType.PlayRobber,
                                action_1.ActionType.PlayYearOfPlenty,
                                action_1.ActionType.PlayRoadBuilder,
                                action_1.ActionType.EndTurn,
                                action_1.ActionType.BuildCity,
                                action_1.ActionType.BuildRoad,
                                action_1.ActionType.BuildSettlement,
                            ];
                    }
                })();
                return validActions.includes(action.type);
            });
            exports_12("default", isValidTransition);
        }
    };
});
System.register("board/port", [], function (exports_13, context_13) {
    "use strict";
    var Port;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [],
        execute: function () {
            Port = class Port {
                constructor(resources, rate) {
                    this.resources = resources;
                    this.rate = rate;
                }
            };
            exports_13("default", Port);
        }
    };
});
System.register("board/node", [], function (exports_14, context_14) {
    "use strict";
    var Node;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [],
        execute: function () {
            Node = class Node {
                constructor() {
                    this.player = -1;
                    this.city = false;
                    this.port = null;
                    this.isEmpty = () => this.player === -1;
                    this.getPort = () => this.port;
                    this.getPlayer = () => this.player;
                    this.hasCity = () => this.city;
                    this.toLog = () => this.isEmpty()
                        ? '(_, empty)'
                        : `(${this.player}, ${this.city ? 'city' : 'set'})`;
                }
                buildSettlement(player) {
                    if (this.player !== -1)
                        return;
                    this.player = player;
                }
                buildCity() {
                    if (this.player === -1)
                        return;
                    this.city = true;
                }
                setPort(port) {
                    if (this.port !== null)
                        return;
                    this.port = port;
                }
            };
            exports_14("Node", Node);
            exports_14("default", Node);
        }
    };
});
System.register("board/tile", ["resource/resource"], function (exports_15, context_15) {
    "use strict";
    var resource_2, Tile;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (resource_2_1) {
                resource_2 = resource_2_1;
            }
        ],
        execute: function () {
            Tile = class Tile {
                constructor(resource, nodes) {
                    this.number = -1;
                    this.getNumber = () => this.number;
                    this.toLog = () => `(${this.number}, ${resource_2.resStr(this.resource)})`;
                    this.resource = resource;
                    this.nodes = nodes;
                }
                setNumber(number) {
                    if (this.number !== -1)
                        return;
                    this.number = number;
                }
                isAdjacentTo(other) {
                    for (let i = 0; i < this.nodes.length; i++) {
                        if (other.nodes.includes(this.nodes[i]))
                            return true;
                    }
                    return false;
                }
            };
            exports_15("Tile", Tile);
            exports_15("default", Tile);
        }
    };
});
System.register("board/board", ["constants", "board/node", "board/tile", "utils", "board/graph", "board/port", "resource/resource"], function (exports_16, context_16) {
    "use strict";
    var constants_5, node_1, tile_1, utils_3, graph_2, port_1, resource_3, Board;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (constants_5_1) {
                constants_5 = constants_5_1;
            },
            function (node_1_1) {
                node_1 = node_1_1;
            },
            function (tile_1_1) {
                tile_1 = tile_1_1;
            },
            function (utils_3_1) {
                utils_3 = utils_3_1;
            },
            function (graph_2_1) {
                graph_2 = graph_2_1;
            },
            function (port_1_1) {
                port_1 = port_1_1;
            },
            function (resource_3_1) {
                resource_3 = resource_3_1;
            }
        ],
        execute: function () {
            Board = class Board {
                constructor() {
                    this.robber = -1;
                    this.adjacentTo = (nid) => this.roadnetwork.children(nid);
                    this.toLog = () => {
                        let o = 'tiles: [ ' +
                            this.tiles
                                .map((tile, i) => `id: ${i} | ${resource_3.resStr(tile.resource)} | ${tile.getNumber()}`)
                                .join(', ') +
                            ' ]\nnodes: [ ';
                        for (let i = 0; i < this.nodes.length; i++) {
                            if (!this.nodes[i].isEmpty()) {
                                o += `id: ${i} | ${this.nodes[i].getPlayer()} | ${this.nodes[i].hasCity() ? 'city' : 'settlement'}, `;
                            }
                        }
                        o += ` ]\nrobber: ${this.robber}`;
                        return o;
                    };
                    this.roadnetwork = this.generateRoadNetwork();
                    this.nodes = this.generateNodes();
                    this.tiles = this.generateTiles();
                }
                generateRoadNetwork() {
                    const g = new graph_2.default([...Array(constants_5.NUM_NODES)].map((_, i) => i));
                    const rowSize = [7, 9, 11, 11, 9, 7];
                    const downOffset = [8, 10, 11, 10, 8];
                    let col = 0;
                    let row = 0;
                    for (let i = 0; i < constants_5.NUM_NODES; i++) {
                        if (col + 1 !== rowSize[row]) {
                            g.addEdge(i, i + 1);
                        }
                        if (row < 3 && col % 2 == 0) {
                            g.addEdge(i, i + downOffset[row]);
                        }
                        else if ((row == 3 || row == 4) && col % 2 == 1) {
                            g.addEdge(i, i + downOffset[row]);
                        }
                        col++;
                        if (col == rowSize[row]) {
                            col = 0;
                            row++;
                        }
                    }
                    return g;
                }
                generateNodes() {
                    const nodes = [...Array(constants_5.NUM_NODES)].map(() => new node_1.default());
                    const ports = [...Array(constants_5.NUM_RESOURCE_TYPES + 1)].map(() => 1);
                    ports[constants_5.NUM_RESOURCE_TYPES] = 4;
                    for (let i = 0; i < constants_5.HAVE_PORTS.length; i++) {
                        const [node0, node1] = constants_5.HAVE_PORTS[i];
                        const index = utils_3.weightedRandom(ports);
                        ports[index]--;
                        let port;
                        if (index === constants_5.NUM_RESOURCE_TYPES) {
                            port = new port_1.default([...Array(constants_5.NUM_RESOURCE_TYPES).keys()], 3);
                        }
                        else {
                            port = new port_1.default([index], 2);
                        }
                        nodes[node0].setPort(port);
                        nodes[node1].setPort(port);
                    }
                    return nodes;
                }
                generateTiles() {
                    const tiles = new Array(constants_5.NUM_TILES);
                    const resources = [...constants_5.NUM_EACH_RESOURCE_TILE, 1];
                    const rowSize = [3, 4, 5, 4, 3];
                    const rowFirstNid = [0, 7, 16, 28, 39];
                    const rowNidOffset = [8, 10, 11, 10, 8];
                    let row = 0;
                    let col = 0;
                    for (let i = 0; i < constants_5.NUM_TILES; i++) {
                        const index = utils_3.weightedRandom(resources);
                        resources[index]--;
                        const nid = 2 * col + rowFirstNid[row];
                        const offset = nid + rowNidOffset[row];
                        const nids = [nid, nid + 1, nid + 2, offset, offset + 1, offset + 2];
                        tiles[i] = new tile_1.default(index, nids);
                        col++;
                        if (col == rowSize[row]) {
                            col = 0;
                            row++;
                        }
                    }
                    const temp = [1, 2, 2, 2, 2];
                    const tokens = [...temp, 0, ...temp.reverse()];
                    const choosable = [...Array(constants_5.NUM_TILES).keys()].map((i) => tiles[i].resource !== resource_3.default.None ? 1 : 0);
                    for (let i = 0; i < 4; i++) {
                        const index = utils_3.weightedRandom(choosable);
                        const number = tokens[4] > 0 ? 6 : 8;
                        tiles[index].setNumber(number);
                        tokens[number - 2]--;
                        for (let j = 0; j < choosable.length; j++) {
                            if (choosable[j] === 1 && tiles[index].isAdjacentTo(tiles[j])) {
                                choosable[j] = 0;
                            }
                        }
                    }
                    for (let i = 0; i < constants_5.NUM_TILES; i++) {
                        if (tiles[i].getNumber() !== -1)
                            continue;
                        const index = tiles[i].resource !== resource_3.default.None ? utils_3.weightedRandom(tokens) : 5;
                        tiles[i].setNumber(index + 2);
                        if (tiles[i].resource === resource_3.default.None) {
                            this.robber = i;
                        }
                        else {
                            tokens[index]--;
                        }
                    }
                    return tiles;
                }
                longestRoadOn(g) {
                    const oddDeg = [];
                    const nodes = g.nodes();
                    for (let i = 0; i < nodes.length; i++) {
                        if (g.degree(nodes[i]) % 2 === 1)
                            oddDeg.push(nodes[i]);
                    }
                    return oddDeg.length <= 2 ? g.edgeCount() : Math.max(...oddDeg.map((i) => utils_3.maxTrail(g, i)));
                }
                getLongestRoad(player) {
                    const edges = [];
                    for (let i = 0; i < constants_5.NUM_NODES; i++) {
                        const node = this.nodes[i];
                        if (this.roadnetwork.getWeight(i, i + 1) === player) {
                            if (!node.isEmpty() && node.getPlayer() !== player) {
                                edges.push([`${i}_l`, `${i + 1}`]);
                            }
                            else if (!this.nodes[i + 1].isEmpty() && this.nodes[i + 1].getPlayer() !== player) {
                                edges.push([`${i}`, `${i + 1}_r`]);
                            }
                            else {
                                edges.push([`${i}`, `${i + 1}`]);
                            }
                        }
                        const below = this.roadnetwork.children(i).filter((id) => id > i + 1)[0];
                        if (below !== undefined && this.roadnetwork.getWeight(i, below) === player) {
                            if (!node.isEmpty() && node.getPlayer() !== player) {
                                edges.push([`${i}_u`, `${below}`]);
                            }
                            else if (!this.nodes[below].isEmpty() && this.nodes[below].getPlayer() !== player) {
                                edges.push([`${i}`, `${below}_d`]);
                            }
                            else {
                                edges.push([`${i}`, `${below}`]);
                            }
                        }
                    }
                    const ccs = utils_3.connectedComponents(new graph_2.default(edges));
                    return Math.max(0, ...ccs.map((cc) => this.longestRoadOn(cc)));
                }
                playersOnRobber() {
                    return this.robber !== -1
                        ? [
                            ...new Set(this.tiles[this.robber].nodes
                                .filter((nid) => !this.nodes[nid].isEmpty())
                                .map((nid) => this.nodes[nid].getPlayer())),
                        ]
                        : [];
                }
                buildRoad(nid0, nid1, player) {
                    this.roadnetwork.setWeight(nid0, nid1, player);
                }
                getRoad(nid0, nid1) {
                    return this.roadnetwork.getWeight(nid0, nid1);
                }
            };
            exports_16("Board", Board);
            exports_16("default", Board);
        }
    };
});
System.register("game", ["constants", "player", "resource/resource_bundle", "action", "turn_fsm", "utils", "dev_card/dev_card_bundle", "board/board", "dev_card/dev_card", "trade_offer"], function (exports_17, context_17) {
    "use strict";
    var constants_6, player_1, resource_bundle_2, action_2, turn_fsm_1, utils_4, dev_card_bundle_2, board_1, dev_card_2, trade_offer_1, GamePhase, Game;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (constants_6_1) {
                constants_6 = constants_6_1;
            },
            function (player_1_1) {
                player_1 = player_1_1;
            },
            function (resource_bundle_2_1) {
                resource_bundle_2 = resource_bundle_2_1;
            },
            function (action_2_1) {
                action_2 = action_2_1;
            },
            function (turn_fsm_1_1) {
                turn_fsm_1 = turn_fsm_1_1;
            },
            function (utils_4_1) {
                utils_4 = utils_4_1;
            },
            function (dev_card_bundle_2_1) {
                dev_card_bundle_2 = dev_card_bundle_2_1;
            },
            function (board_1_1) {
                board_1 = board_1_1;
            },
            function (dev_card_2_1) {
                dev_card_2 = dev_card_2_1;
            },
            function (trade_offer_1_1) {
                trade_offer_1 = trade_offer_1_1;
            }
        ],
        execute: function () {
            (function (GamePhase) {
                GamePhase["SetupForward"] = "Forward Setup";
                GamePhase["SetupBackward"] = "Backward Setup";
                GamePhase["Playing"] = "Playing";
                GamePhase["Finished"] = "Finished";
            })(GamePhase || (GamePhase = {}));
            exports_17("GamePhase", GamePhase);
            Game = class Game {
                constructor() {
                    this.currPlayer = () => this.players[this.turn];
                    this.getTurn = () => this.turn;
                    this.getLastRoll = () => this.lastRoll;
                    this.getTradeOffers = () => this.tradeOffers;
                    this.getPhase = () => this.phase;
                    this.getWinner = () => this.winner;
                    this.getTurnState = () => this.turnState;
                    this.getFreeRoads = () => this.freeRoads;
                    this.getMustDiscard = () => this.mustDiscard;
                    this.getHasRolled = () => this.hasRolled;
                    this.getTile = (t) => this.board.tiles[t];
                    this.getNode = (n) => this.board.nodes[n];
                    this.getRoad = (n0, n1) => this.board.getRoad(n0, n1);
                    this.toLog = () => {
                        let o = '';
                        o += this.board.toLog() + '\n';
                        o +=
                            'lastRoll: ' +
                                this.lastRoll +
                                ' | phase: ' +
                                this.phase +
                                ' | turnState: ' +
                                this.turnState +
                                ' | turn: ' +
                                this.turn +
                                '\n';
                        o += 'Players: \n';
                        for (let i = 0; i < constants_6.NUM_PLAYERS; i++)
                            o += this.players[i].toLog() + '\n';
                        o += 'Trade Offers: \n';
                        for (let i = 0; i < this.tradeOffers.length; i++)
                            o += this.tradeOffers[i].toLog() + '\n';
                        o += 'Bank: ' + this.bank.toLog() + '\n';
                        o += 'Deck: ' + this.deck.toLog() + '\n';
                        o += 'Largest Army: ' + JSON.stringify(this.largestArmy) + '\n';
                        o += 'Longest Road: ' + JSON.stringify(this.longestRoad) + '\n';
                        o +=
                            'Free Roads: ' +
                                this.freeRoads +
                                ' | hasRolled: ' +
                                this.hasRolled +
                                ' | winner: ' +
                                this.winner +
                                '\n';
                        if (this.mustDiscard.includes(true))
                            o += 'mustDiscard: ' + this.mustDiscard.toString() + '\n';
                        return o;
                    };
                    this.bank = new resource_bundle_2.default(constants_6.NUM_EACH_RESOURCE);
                    this.deck = new dev_card_bundle_2.default([
                        constants_6.NUM_KNIGHTS,
                        constants_6.NUM_VPS,
                        constants_6.NUM_YEAR_OF_PLENTY,
                        constants_6.NUM_MONOPOLY,
                        constants_6.NUM_ROAD_BUILDING,
                    ]);
                    this.board = new board_1.default();
                    this.turn = 0;
                    this.players = [...Array(constants_6.NUM_PLAYERS)].map(() => new player_1.default());
                    this.tradeOffers = [];
                    this.freeRoads = 0;
                    this.hasRolled = false;
                    this.phase = GamePhase.SetupForward;
                    this.winner = -1;
                    this.lastRoll = -1;
                    this.turnState = turn_fsm_1.TurnState.SetupSettlement;
                    this.mustDiscard = [...Array(constants_6.NUM_PLAYERS)].map(() => false);
                    this.largestArmy = { owner: -1, size: constants_6.MIN_LARGEST_ARMY - 1 };
                    this.longestRoad = { owner: -1, len: constants_6.MIN_LONGEST_ROAD - 1 };
                }
                transferLongestRoad(owner, length) {
                    if (this.longestRoad.owner !== -1)
                        this.players[this.longestRoad.owner].victoryPoints -= 2;
                    this.longestRoad.owner = owner;
                    this.longestRoad.len = length;
                    this.players[owner].victoryPoints += 2;
                }
                checkWinner() {
                    for (let i = 0; i < constants_6.NUM_PLAYERS; i++) {
                        if (this.players[i].victoryPoints >= constants_6.VPS_TO_WIN) {
                            this.phase = GamePhase.Finished;
                            this.winner = i;
                            return;
                        }
                    }
                }
                do_roll(action) {
                    const { value } = action.payload;
                    this.lastRoll = value;
                    if (value !== 7) {
                        const production = [...Array(constants_6.NUM_PLAYERS)].map(() => new resource_bundle_2.default());
                        const prodTiles = this.board.tiles.filter((tile, i) => this.board.robber !== i && tile.getNumber() === value);
                        for (let i = 0; i < prodTiles.length; i++) {
                            const tile = prodTiles[i];
                            for (let j = 0; j < tile.nodes.length; j++) {
                                const node = this.board.nodes[tile.nodes[j]];
                                if (!node.isEmpty()) {
                                    production[node.getPlayer()].add(tile.resource, node.hasCity() ? 2 : 1);
                                }
                            }
                        }
                        for (let i = 0; i < constants_6.NUM_RESOURCE_TYPES; i++) {
                            let sum = 0;
                            for (let j = 0; j < production.length; j++) {
                                sum += production[j].get(i);
                            }
                            if (sum > this.bank.get(i)) {
                                production.forEach((bundle) => bundle.removeAll(i));
                            }
                        }
                        for (let i = 0; i < production.length; i++) {
                            this.players[i].resources.add(production[i]);
                        }
                        this.turnState = turn_fsm_1.TurnState.Postroll;
                    }
                    else {
                        this.mustDiscard = this.players.map(({ resources }) => resources.size() > constants_6.ROBBER_LIMIT);
                        this.turnState = this.mustDiscard.includes(true)
                            ? turn_fsm_1.TurnState.Discarding
                            : turn_fsm_1.TurnState.MovingRobber;
                    }
                    this.hasRolled = true;
                }
                do_buildSettlement(action) {
                    const { node } = action.payload;
                    if (this.phase === GamePhase.Playing) {
                        this.board.nodes[node].buildSettlement(this.turn);
                        resource_bundle_2.default.trade(this.currPlayer().resources, resource_bundle_2.default.settlementCost, this.bank, new resource_bundle_2.default());
                        if (this.longestRoad.owner !== this.turn) {
                            for (let i = 0; i < constants_6.NUM_PLAYERS; i++) {
                                const myLength = this.board.getLongestRoad(i);
                                if (myLength > this.longestRoad.len)
                                    this.transferLongestRoad(i, myLength);
                            }
                        }
                        this.checkWinner();
                    }
                    else {
                        this.board.nodes[node].buildSettlement(this.turn);
                        if (this.phase === GamePhase.SetupBackward) {
                            this.board.tiles
                                .filter(({ nodes }) => nodes.includes(node))
                                .forEach(({ resource }) => {
                                this.currPlayer().resources.add(resource, 1);
                                this.bank.subtract(resource, 1);
                            });
                        }
                        this.turnState = turn_fsm_1.TurnState.SetupRoad;
                    }
                    const port = this.board.nodes[node].getPort();
                    if (port !== null) {
                        const prevRates = this.currPlayer().rates;
                        for (let i = 0; i < port.resources.length; i++) {
                            const res = port.resources[i];
                            prevRates.set(res, Math.min(prevRates.get(res), port.rate));
                        }
                    }
                    this.currPlayer().victoryPoints++;
                    this.currPlayer().settlements--;
                }
                do_buildRoad(action) {
                    const { node0, node1 } = action.payload;
                    this.currPlayer().roads--;
                    if (this.phase === GamePhase.Playing) {
                        this.board.buildRoad(node0, node1, this.turn);
                        if (this.freeRoads === 0) {
                            resource_bundle_2.default.trade(this.currPlayer().resources, resource_bundle_2.default.roadCost, this.bank, new resource_bundle_2.default());
                        }
                        else {
                            this.freeRoads--;
                        }
                        const { owner, len } = this.longestRoad;
                        if (owner !== this.turn) {
                            const myLength = this.board.getLongestRoad(this.turn);
                            if (myLength > len) {
                                this.transferLongestRoad(this.turn, myLength);
                                this.checkWinner();
                            }
                        }
                    }
                    else {
                        this.board.buildRoad(node0, node1, this.turn);
                        if (this.phase === GamePhase.SetupForward) {
                            if (this.turn === constants_6.NUM_PLAYERS - 1) {
                                this.phase = GamePhase.SetupBackward;
                            }
                            else {
                                this.turn++;
                            }
                            this.turnState = turn_fsm_1.TurnState.SetupSettlement;
                        }
                        else {
                            if (this.turn === 0) {
                                this.phase = GamePhase.Playing;
                                this.turnState = turn_fsm_1.TurnState.Preroll;
                            }
                            else {
                                this.turn--;
                                this.turnState = turn_fsm_1.TurnState.SetupSettlement;
                            }
                        }
                    }
                }
                do_buildCity(action) {
                    const { node } = action.payload;
                    this.board.nodes[node].buildCity();
                    resource_bundle_2.default.trade(this.currPlayer().resources, resource_bundle_2.default.cityCost, this.bank, new resource_bundle_2.default());
                    this.currPlayer().victoryPoints++;
                    this.currPlayer().cities--;
                    this.checkWinner();
                }
                do_playRobber() {
                    this.currPlayer().devCards.remove(dev_card_2.default.Knight);
                    this.currPlayer().knightsPlayed++;
                    const { owner, size } = this.largestArmy;
                    if (owner !== this.turn && this.currPlayer().knightsPlayed > size) {
                        if (owner !== -1)
                            this.players[owner].victoryPoints -= 2;
                        this.currPlayer().victoryPoints += 2;
                        this.largestArmy.owner = this.turn;
                        this.largestArmy.size = this.currPlayer().knightsPlayed;
                        this.checkWinner();
                    }
                    this.turnState = turn_fsm_1.TurnState.MovingRobber;
                }
                do_moveRobber(action) {
                    const { to } = action.payload;
                    this.board.robber = to;
                    if (this.board.playersOnRobber().find((p) => p !== this.turn) !== undefined) {
                        this.turnState = turn_fsm_1.TurnState.Robbing;
                    }
                    else {
                        this.turnState = this.hasRolled ? turn_fsm_1.TurnState.Postroll : turn_fsm_1.TurnState.Preroll;
                    }
                }
                do_Rob(action) {
                    const { victim } = action.payload;
                    const res = this.players[victim].resources.removeOneAtRandom();
                    this.currPlayer().resources.add(res, 1);
                    this.turnState = this.hasRolled ? turn_fsm_1.TurnState.Postroll : turn_fsm_1.TurnState.Preroll;
                }
                do_playMonopoly() {
                    this.currPlayer().devCards.remove(dev_card_2.default.Monopoly);
                    this.turnState = turn_fsm_1.TurnState.SelectingMonopolyResource;
                }
                do_selectMonopolyResource(action) {
                    const { resource } = action.payload;
                    for (let i = 0; i < constants_6.NUM_PLAYERS; i++) {
                        if (i === this.turn)
                            continue;
                        const amnt = this.players[i].resources.removeAll(resource);
                        this.currPlayer().resources.add(resource, amnt);
                    }
                    this.turnState = this.hasRolled ? turn_fsm_1.TurnState.Postroll : turn_fsm_1.TurnState.Preroll;
                }
                do_playYearOfPlenty() {
                    this.currPlayer().devCards.remove(dev_card_2.default.YearOfPlenty);
                    this.turnState = turn_fsm_1.TurnState.SelectingYearOfPlentyResources;
                }
                do_selectYearOfPlentyResources(action) {
                    const { resources } = action.payload;
                    for (let i = 0; i < 2; i++) {
                        this.currPlayer().resources.add(i, 1);
                        this.bank.subtract(i, 1);
                    }
                    this.turnState = this.hasRolled ? turn_fsm_1.TurnState.Postroll : turn_fsm_1.TurnState.Preroll;
                }
                do_playRoadBuilder() {
                    this.currPlayer().devCards.remove(dev_card_2.default.RoadBuilder);
                    this.freeRoads = 2;
                    this.turnState = this.hasRolled ? turn_fsm_1.TurnState.Preroll : turn_fsm_1.TurnState.Postroll;
                }
                do_discard(action) {
                    const { bundle } = action.payload;
                    this.players[action.player].resources.subtract(bundle);
                    this.mustDiscard[action.player] = false;
                    this.turnState = this.mustDiscard.includes(true) ? turn_fsm_1.TurnState.Discarding : turn_fsm_1.TurnState.MovingRobber;
                }
                do_drawDevCard(action) {
                    const { card } = action.payload;
                    this.currPlayer().devCards.add(card);
                    this.deck.remove(card);
                    if (card === dev_card_2.default.VictoryPoint) {
                        this.currPlayer().victoryPoints++;
                        this.checkWinner();
                    }
                }
                do_exchange(action) {
                    const { offer, request } = action.payload;
                    const rate = this.currPlayer().rates.get(offer);
                    this.bank.add(offer, rate);
                    this.bank.subtract(request, 1);
                    this.currPlayer().resources.add(request, 1);
                }
                do_makeTradeOffer(action) {
                    const { offer, request } = action.payload;
                    const id = this.tradeOffers.length > 0 ? this.tradeOffers[this.tradeOffers.length - 1].id + 1 : 0;
                    this.tradeOffers.push(new trade_offer_1.default(id, action.player, offer, request));
                }
                do_decideOnTradeOffer(action) {
                    const { status, withPlayer, id } = action.payload;
                    const index = this.tradeOffers.findIndex((to) => to.id === id);
                    const tradeOffer = this.tradeOffers[index];
                    if (tradeOffer.offerer === action.player) {
                        if (status === trade_offer_1.TradeStatus.Decline) {
                            this.tradeOffers.splice(index, 1);
                        }
                        else if (withPlayer !== undefined) {
                            resource_bundle_2.default.trade(tradeOffer.request, this.players[withPlayer].resources, tradeOffer.offer, this.players[action.player].resources);
                            this.tradeOffers.splice(index, 1);
                        }
                    }
                    else {
                        tradeOffer.status[action.player] = status;
                        if (status === trade_offer_1.TradeStatus.Decline && tradeOffer.allDeclined()) {
                            this.tradeOffers.splice(index, 1);
                        }
                    }
                }
                do_endTurn() {
                    this.freeRoads = 0;
                    this.turn = (this.turn + 1) % constants_6.NUM_PLAYERS;
                    this.hasRolled = false;
                    this.turnState = turn_fsm_1.TurnState.Preroll;
                    this.tradeOffers = [];
                }
                doAction(action) {
                    const { type } = action;
                    if (type === action_2.ActionType.Roll) {
                        this.do_roll(action);
                    }
                    else if (type === action_2.ActionType.PlayRobber) {
                        this.do_playRobber();
                    }
                    else if (type === action_2.ActionType.MoveRobber) {
                        this.do_moveRobber(action);
                    }
                    else if (type === action_2.ActionType.Rob) {
                        this.do_Rob(action);
                    }
                    else if (type === action_2.ActionType.PlayMonopoly) {
                        this.do_playMonopoly();
                    }
                    else if (type === action_2.ActionType.SelectMonopolyResource) {
                        this.do_selectMonopolyResource(action);
                    }
                    else if (type === action_2.ActionType.PlayYearOfPlenty) {
                        this.do_playYearOfPlenty();
                    }
                    else if (type === action_2.ActionType.SelectYearOfPlentyResources) {
                        this.do_selectYearOfPlentyResources(action);
                    }
                    else if (type === action_2.ActionType.PlayRoadBuilder) {
                        this.do_playRoadBuilder();
                    }
                    else if (type === action_2.ActionType.BuildSettlement) {
                        this.do_buildSettlement(action);
                    }
                    else if (type === action_2.ActionType.BuildCity) {
                        this.do_buildCity(action);
                    }
                    else if (type === action_2.ActionType.BuildRoad) {
                        this.do_buildRoad(action);
                    }
                    else if (type === action_2.ActionType.Discard) {
                        this.do_discard(action);
                    }
                    else if (type === action_2.ActionType.MakeTradeOffer) {
                        this.do_makeTradeOffer(action);
                    }
                    else if (type === action_2.ActionType.DecideOnTradeOffer) {
                        this.do_decideOnTradeOffer(action);
                    }
                    else if (type === action_2.ActionType.DrawDevCard) {
                        this.do_drawDevCard(action);
                    }
                    else if (type === action_2.ActionType.Exchange) {
                        this.do_exchange(action);
                    }
                    else {
                        this.do_endTurn();
                    }
                }
                verifyActionWithState(action) {
                    const { type, payload, player } = action;
                    if (type === action_2.ActionType.Roll) {
                        const { value } = payload;
                        return value === undefined || (value > 0 && value < 13);
                    }
                    else if (type === action_2.ActionType.PlayRobber) {
                        return this.currPlayer().devCards.has(dev_card_2.default.Knight);
                    }
                    else if (type === action_2.ActionType.MoveRobber) {
                        const { to } = payload;
                        return to > -1 && to < constants_6.NUM_TILES && to !== this.board.robber;
                    }
                    else if (type === action_2.ActionType.Rob) {
                        const { victim } = payload;
                        const selectable = this.board.tiles[this.board.robber].nodes.map((nid) => this.board.nodes[nid].getPlayer());
                        return victim !== -1 && victim !== player && selectable.includes(victim);
                    }
                    else if (type === action_2.ActionType.PlayMonopoly) {
                        return this.currPlayer().devCards.has(dev_card_2.default.Monopoly);
                    }
                    else if (type === action_2.ActionType.PlayYearOfPlenty) {
                        return this.currPlayer().devCards.has(dev_card_2.default.YearOfPlenty);
                    }
                    else if (type === action_2.ActionType.SelectYearOfPlentyResources) {
                        const [res1, res2] = payload.resources;
                        return this.bank.get(res1) > 1 && this.bank.get(res2) > 1;
                    }
                    else if (type === action_2.ActionType.PlayRoadBuilder) {
                        return this.currPlayer().devCards.has(dev_card_2.default.RoadBuilder);
                    }
                    else if (type === action_2.ActionType.BuildSettlement) {
                        const node = payload.node;
                        return (node > -1 &&
                            node < constants_6.NUM_TILES &&
                            this.board.nodes[node].isEmpty() &&
                            this.board.adjacentTo(node).find((other) => !this.board.nodes[other].isEmpty()) ===
                                undefined &&
                            (this.phase !== GamePhase.Playing ||
                                this.currPlayer().resources.has(resource_bundle_2.default.settlementCost)));
                    }
                    else if (type === action_2.ActionType.BuildCity) {
                        const node = payload.node;
                        return (node > -1 &&
                            node < constants_6.NUM_TILES &&
                            this.board.nodes[node].getPlayer() === this.turn &&
                            !this.board.nodes[node].hasCity() &&
                            this.currPlayer().resources.has(resource_bundle_2.default.cityCost));
                    }
                    else if (type === action_2.ActionType.BuildRoad) {
                        const { node0, node1 } = payload;
                        const nodesValid = node0 > -1 && node1 > -1 && node0 < constants_6.NUM_NODES && node1 < constants_6.NUM_NODES;
                        if (!nodesValid)
                            return false;
                        const adj0 = this.board.adjacentTo(node0);
                        const adj1 = this.board.adjacentTo(node1);
                        return (adj0.includes(node1) &&
                            this.board.getRoad(node0, node1) === -1 &&
                            (this.phase !== GamePhase.Playing ||
                                this.currPlayer().resources.has(resource_bundle_2.default.roadCost)) &&
                            (this.board.nodes[node0].getPlayer() === this.turn ||
                                this.board.nodes[node1].getPlayer() === this.turn ||
                                adj0.find((onid0) => this.board.getRoad(onid0, node0) === this.turn) !== undefined ||
                                adj1.find((onid1) => this.board.getRoad(onid1, node1) === this.turn) !== undefined));
                    }
                    else if (type === action_2.ActionType.Discard) {
                        const { bundle } = payload;
                        return (this.mustDiscard[player] &&
                            this.players[player].resources.has(bundle) &&
                            bundle.size() === Math.floor(this.players[player].resources.size() / 2));
                    }
                    else if (type === action_2.ActionType.MakeTradeOffer) {
                        const { offer } = payload;
                        return this.players[player].resources.has(offer);
                    }
                    else if (type === action_2.ActionType.DecideOnTradeOffer) {
                        const { status, id, withPlayer } = payload;
                        const tradeOffer = this.tradeOffers.find((offer) => offer.id === id);
                        return tradeOffer !== undefined;
                    }
                    else if (type === action_2.ActionType.DrawDevCard) {
                        const { card } = payload;
                        return !this.deck.isEmpty() && (card === undefined || this.deck.has(card));
                    }
                    else if (type === action_2.ActionType.Exchange) {
                        const { offer, request } = payload;
                        const rate = this.currPlayer().rates.get(offer);
                        return this.currPlayer().resources.get(offer) >= rate && this.bank.get(request) > 1;
                    }
                    return true;
                }
                isValidAction(action) {
                    if (action.player != this.turn &&
                        (this.turnState === turn_fsm_1.TurnState.Preroll ||
                            ![action_2.ActionType.Discard, action_2.ActionType.MakeTradeOffer, action_2.ActionType.DecideOnTradeOffer].includes(action.type))) {
                        return { valid: false, status: 'Restricted action.' };
                    }
                    if (!turn_fsm_1.default(this.turnState, action)) {
                        return { valid: false, status: 'Invalid transition.' };
                    }
                    const valid = this.verifyActionWithState(action);
                    return { valid, status: valid ? 'works!' : 'Violates game state.' };
                }
                handleAction(action) {
                    const { valid, status } = this.isValidAction(action);
                    if (!valid) {
                        console.log(status);
                        return null;
                    }
                    if (action.type === action_2.ActionType.Roll) {
                        const payload = action.payload;
                        if (payload.value === undefined)
                            payload.value = utils_4.rollDie() + utils_4.rollDie();
                    }
                    else if (action.type === action_2.ActionType.DrawDevCard) {
                        const payload = action.payload;
                        if (payload.card === undefined)
                            payload.card = this.deck.pickOneAtRandom();
                    }
                    this.doAction(action);
                    return action;
                }
            };
            exports_17("Game", Game);
            exports_17("default", Game);
        }
    };
});
//# sourceMappingURL=settlers.js.map