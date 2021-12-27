declare module "dev_card/dev_card" {
    export enum DevCard {
        Knight = 0,
        VictoryPoint = 1,
        YearOfPlenty = 2,
        Monopoly = 3,
        RoadBuilder = 4
    }
    export const devCardStr: (c: DevCard) => "knight" | "victory point" | "yop" | "monopoly" | "road builder";
    export default DevCard;
}
declare module "resource/resource" {
    export enum Resource {
        Brick = 0,
        Lumber = 1,
        Ore = 2,
        Grain = 3,
        Wool = 4,
        None = 5
    }
    export const resStr: (res: Resource) => "brick" | "lumber" | "ore" | "grain" | "wool" | "none";
    export default Resource;
}
declare module "constants" {
    export const NUM_RESOURCE_TYPES: number;
    export const NUM_EACH_RESOURCE_TILE: number[];
    export const NUM_DEV_CARD_TYPES: number;
    export const NUM_PLAYERS: number;
    export const NUM_SETTLEMENTS: number;
    export const NUM_CITIES: number;
    export const NUM_ROADS: number;
    export const NUM_EACH_RESOURCE: number;
    export const NUM_VPS: number;
    export const NUM_KNIGHTS: number;
    export const NUM_ROAD_BUILDING: number;
    export const NUM_YEAR_OF_PLENTY: number;
    export const NUM_MONOPOLY: number;
    export const RES_PER_SETTLEMENT: number;
    export const RES_PER_CITY: number;
    export const MIN_LONGEST_ROAD: number;
    export const MIN_LARGEST_ARMY: number;
    export const BANK_RATE: number;
    export const VPS_TO_WIN: number;
    export const ROBBER_LIMIT: number;
    export const NUM_NODES: number;
    export const NUM_EDGES: number;
    export const NUM_TILES: number;
    export const HAVE_PORTS: [number, number][];
}
declare module "board/graph" {
    export class Graph<T> {
        private al;
        private keys;
        constructor(nodes: T[]);
        constructor(edges: [T, T][]);
        private keyOf;
        hasNode: (v: T) => boolean;
        hasEdge: (u: T, v: T) => boolean;
        addEdge(u: T, v: T, w?: number): void;
        deleteEdge(u: T, v: T): void;
        getWeight(u: T, v: T): number;
        setWeight(u: T, v: T, w: number): void;
        degree: (u: T) => number;
        children: (u: T) => T[];
        nodeCount: () => number;
        nodes: () => T[];
        edgeCount: () => number;
    }
    export default Graph;
}
declare module "utils" {
    import Graph from "board/graph";
    export const weightedRandom: (weights: number[]) => number;
    export const rollDie: () => number;
    export const uniformRandom: (lo: number, hi: number) => number;
    export function maxTrailRec<T>(v: T, g: Graph<T>, seen: Graph<T>): number;
    export const maxTrail: <T>(g: Graph<T>, src: T) => number;
    export const connectedComponents: <T>(g: Graph<T>) => Graph<T>[];
    export interface BFSTraveral<T> {
        visited: Set<T>;
        depth: number;
    }
    export const breadthFirstSearch: <T>(g: Graph<T>, src: T) => BFSTraveral<T>;
}
declare module "loggable" {
    export interface Loggable {
        toLog: () => string;
    }
    export default Loggable;
}
declare module "resource/resource_bundle" {
    import Resource from "resource/resource";
    import Loggable from "loggable";
    export class ResourceBundle implements Loggable {
        private bundle;
        constructor();
        constructor(amnt: number);
        constructor(amnts: number[]);
        has(bundle: ResourceBundle): boolean;
        get(resource: Resource): number;
        set(resource: Resource, amnt: number): void;
        add(bundle: ResourceBundle): void;
        add(resource: Resource, amnt: number): void;
        subtract(bundle: ResourceBundle): void;
        subtract(resource: Resource, amnt: number): void;
        static trade(fromOffereeBundle: ResourceBundle, offereeBundle: ResourceBundle, fromOffererBundle: ResourceBundle, offererBundle: ResourceBundle): void;
        removeAll(resource: Resource): number;
        removeOneAtRandom(): Resource;
        size(): number;
        isEmpty(): boolean;
        static roadCost: ResourceBundle;
        static settlementCost: ResourceBundle;
        static cityCost: ResourceBundle;
        static devCardCost: ResourceBundle;
        toLog: () => string;
    }
    export default ResourceBundle;
}
declare module "trade_offer" {
    import Loggable from "loggable";
    import ResourceBundle from "resource/resource_bundle";
    export enum TradeStatus {
        Pending = 0,
        Accept = 1,
        Decline = 2
    }
    export class TradeOffer implements Loggable {
        readonly id: number;
        readonly offerer: number;
        readonly offer: ResourceBundle;
        readonly request: ResourceBundle;
        readonly status: TradeStatus[];
        constructor(id: number, offerer: number, offer: ResourceBundle, request: ResourceBundle);
        allDeclined: () => boolean;
        toLog: () => string;
    }
    export default TradeOffer;
}
declare module "action" {
    import DevCard from "dev_card/dev_card";
    import Resource from "resource/resource";
    import ResourceBundle from "resource/resource_bundle";
    import { TradeStatus } from "trade_offer";
    export enum ActionType {
        Roll = 0,
        PlayRobber = 1,
        MoveRobber = 2,
        Rob = 3,
        PlayMonopoly = 4,
        SelectMonopolyResource = 5,
        PlayYearOfPlenty = 6,
        SelectYearOfPlentyResources = 7,
        PlayRoadBuilder = 8,
        BuildSettlement = 9,
        BuildCity = 10,
        BuildRoad = 11,
        Discard = 12,
        MakeTradeOffer = 13,
        DecideOnTradeOffer = 14,
        DrawDevCard = 15,
        Exchange = 16,
        EndTurn = 17
    }
    export const actionTypeStr: (a: ActionType) => "Roll" | "Play Robber" | "Move Robber" | "Rob" | "Play Monopoly" | "Select Monopoly Resource" | "Play YOP" | "Select YOP Resources" | "Play Road Builder" | "Build Settlement" | "Build City" | "Build Road" | "Discard" | "Make Trade Offer" | "Decide on Trade Offer" | "Draw Dev Card" | "Exchange" | "End Turn";
    export interface ActionPayload {
    }
    export interface ExchangePayload extends ActionPayload {
        offer: Resource;
        request: Resource;
    }
    export interface MakeTradeOfferPayload extends ActionPayload {
        offer: ResourceBundle;
        request: ResourceBundle;
    }
    export interface TradeOfferDecisionPayload extends ActionPayload {
        status: TradeStatus;
        id: number;
        withPlayer?: number;
    }
    export interface DiscardPayload extends ActionPayload {
        bundle: ResourceBundle;
    }
    export interface DrawDevCardPayload extends ActionPayload {
        card: DevCard;
    }
    export interface RollPayload extends ActionPayload {
        value: number;
    }
    export interface MoveRobberPayload extends ActionPayload {
        to: number;
    }
    export interface RobPayload extends ActionPayload {
        victim: number;
    }
    export interface SelectMonopolyResourcePayload extends ActionPayload {
        resource: Resource;
    }
    export interface SelectYearOfPlentyResourcesPayload extends ActionPayload {
        resources: [Resource, Resource];
    }
    export interface BuildSettlementPayload extends ActionPayload {
        node: number;
    }
    export interface BuildCityPayload extends ActionPayload {
        node: number;
    }
    export interface BuildRoadPayload extends ActionPayload {
        node0: number;
        node1: number;
    }
    export class Action {
        readonly type: ActionType;
        readonly payload: ActionPayload;
        readonly player: number;
        constructor(type: ActionType, player?: number, payload?: ActionPayload);
        serialized: () => string;
        static deserialize: (serializedObj: string) => Action;
    }
    export default Action;
}
declare module "dev_card/dev_card_bundle" {
    import DevCard from "dev_card/dev_card";
    import Loggable from "loggable";
    export class DevCardBundle implements Loggable {
        private bundle;
        constructor();
        constructor(amnt: number);
        constructor(amnts: number[]);
        add(devcard: DevCard): void;
        remove(devcard: DevCard): void;
        has(devcard: DevCard): boolean;
        pickOneAtRandom(): DevCard;
        size(): number;
        isEmpty(): boolean;
        toLog: () => string;
    }
    export default DevCardBundle;
}
declare module "player" {
    import DevCardBundle from "dev_card/dev_card_bundle";
    import Loggable from "loggable";
    import ResourceBundle from "resource/resource_bundle";
    export class Player implements Loggable {
        readonly resources: ResourceBundle;
        readonly rates: ResourceBundle;
        readonly devCards: DevCardBundle;
        knightsPlayed: number;
        victoryPoints: number;
        cities: number;
        settlements: number;
        roads: number;
        constructor();
        toLog: () => string;
    }
    export default Player;
}
declare module "turn_fsm" {
    import { Action } from "action";
    export enum TurnState {
        SetupSettlement = "Setup Settlement",
        SetupRoad = "Setup Road",
        Preroll = "Pre-roll",
        Postroll = "Post-roll",
        MovingRobber = "Moving Robber",
        Robbing = "Robbing",
        SelectingMonopolyResource = "Selecting Monopoly Resource",
        SelectingYearOfPlentyResources = "Selecting Year of Plenty Resource",
        Discarding = "Discarding"
    }
    export const isValidTransition: (state: TurnState, action: Action) => boolean;
    export default isValidTransition;
}
declare module "board/port" {
    import Resource from "resource/resource";
    class Port {
        readonly resources: Resource[];
        readonly rate: number;
        constructor(resources: Resource[], rate: number);
    }
    export default Port;
}
declare module "board/node" {
    import Loggable from "loggable";
    import Port from "board/port";
    export class Node implements Loggable {
        private player;
        private city;
        private port;
        isEmpty: () => boolean;
        getPort: () => Port | null;
        getPlayer: () => number;
        hasCity: () => boolean;
        buildSettlement(player: number): void;
        buildCity(): void;
        setPort(port: Port): void;
        toLog: () => string;
    }
    export default Node;
}
declare module "board/tile" {
    import Loggable from "loggable";
    import Resource from "resource/resource";
    export class Tile implements Loggable {
        readonly resource: Resource;
        readonly nodes: number[];
        private number;
        constructor(resource: Resource, nodes: number[]);
        setNumber(number: number): void;
        getNumber: () => number;
        isAdjacentTo(other: Tile): boolean;
        toLog: () => string;
    }
    export default Tile;
}
declare module "board/board" {
    import Node from "board/node";
    import Tile from "board/tile";
    import Graph from "board/graph";
    import Loggable from "loggable";
    export class Board implements Loggable {
        readonly nodes: Node[];
        readonly roadnetwork: Graph<number>;
        readonly tiles: Tile[];
        robber: number;
        constructor();
        private generateRoadNetwork;
        private generateNodes;
        private generateTiles;
        private longestRoadOn;
        getLongestRoad(player: number): number;
        playersOnRobber(): number[];
        buildRoad(nid0: number, nid1: number, player: number): void;
        getRoad(nid0: number, nid1: number): number;
        adjacentTo: (nid: number) => number[];
        toLog: () => string;
    }
    export default Board;
}
declare module "game" {
    import Player from "player";
    import ResourceBundle from "resource/resource_bundle";
    import Action from "action";
    import { TurnState } from "turn_fsm";
    import DevCardBundle from "dev_card/dev_card_bundle";
    import TradeOffer from "trade_offer";
    import Loggable from "loggable";
    export enum GamePhase {
        SetupForward = "Forward Setup",
        SetupBackward = "Backward Setup",
        Playing = "Playing",
        Finished = "Finished"
    }
    export class Game implements Loggable {
        readonly bank: ResourceBundle;
        readonly deck: DevCardBundle;
        private readonly board;
        private turn;
        private lastRoll;
        readonly players: Player[];
        private tradeOffers;
        private phase;
        private winner;
        private turnState;
        private freeRoads;
        private mustDiscard;
        private hasRolled;
        readonly largestArmy: {
            owner: number;
            size: number;
        };
        readonly longestRoad: {
            owner: number;
            len: number;
        };
        constructor();
        private transferLongestRoad;
        private checkWinner;
        private currPlayer;
        private do_roll;
        private do_buildSettlement;
        private do_buildRoad;
        private do_buildCity;
        private do_playRobber;
        private do_moveRobber;
        private do_Rob;
        private do_playMonopoly;
        private do_selectMonopolyResource;
        private do_playYearOfPlenty;
        private do_selectYearOfPlentyResources;
        private do_playRoadBuilder;
        private do_discard;
        private do_drawDevCard;
        private do_exchange;
        private do_makeTradeOffer;
        private do_decideOnTradeOffer;
        private do_endTurn;
        private doAction;
        private verifyActionWithState;
        isValidAction(action: Action): {
            valid: boolean;
            status: string;
        };
        handleAction(action: Action): null | Action;
        getTurn: () => number;
        getLastRoll: () => number;
        getTradeOffers: () => TradeOffer[];
        getPhase: () => GamePhase;
        getWinner: () => number;
        getTurnState: () => TurnState;
        getFreeRoads: () => number;
        getMustDiscard: () => boolean[];
        getHasRolled: () => boolean;
        getTile: (t: number) => import("board/tile").Tile;
        getNode: (n: number) => import("board/node").Node;
        getRoad: (n0: number, n1: number) => number;
        toLog: () => string;
    }
    export default Game;
}
