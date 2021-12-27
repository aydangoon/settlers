declare module "game/dev_card/dev_card" {
    /**
     * DevCard. each maps to a number so it can be used to index dev card bundles.
     */
    export enum DevCard {
        Knight = 0,
        VictoryPoint = 1,
        YearOfPlenty = 2,
        Monopoly = 3,
        RoadBuilder = 4
    }
    /**
     * Get the string representation of a dev card.
     * @param c The Dev card.
     * @returns The string representation.
     */
    export const devCardStr: (c: DevCard) => "knight" | "victory point" | "yop" | "monopoly" | "road builder";
    export default DevCard;
}
declare module "game/resource/resource" {
    /**
     * Resources. each maps to a number so it can be used to index resource bundles.
     */
    export enum Resource {
        Brick = 0,
        Lumber = 1,
        Ore = 2,
        Grain = 3,
        Wool = 4,
        None = 5
    }
    /**
     * Get a string representation of a resource.
     * @param res The resource.
     * @returns A string representation of the resource.
     */
    export const resStr: (res: Resource) => "brick" | "lumber" | "ore" | "grain" | "wool" | "none";
    export default Resource;
}
declare module "game/constants" {
    /**
     * A bunch of constants so we can avoid magic number :)
     * @module
     */
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
    /**
     * If you have more than `ROBBER_LIMIT` cards when a 7 is rolled, you must
     * discard half your cards.
     */
    export const ROBBER_LIMIT: number;
    /** Board stuff. TODO I'm lazy and these shouldn't be constants it
     * should be calculated mathematically but ill come around to it.
     */
    export const NUM_NODES: number;
    export const NUM_EDGES: number;
    export const NUM_TILES: number;
    export const HAVE_PORTS: [number, number][];
}
declare module "game/board/graph" {
    /**
     * An undirected, weighted, simple graph with a fixed number of nodes (created on initialization)
     * implemented with an adjacency list. The graph can store anything. **Note**, internally uses === to
     * check for equality.
     */
    export class Graph<T> {
        /** Internal adjacency matrix */
        private al;
        /** Internal mapping of an element to its index. Used to index adjacency list. */
        private keys;
        /**
         * @param nodes A list of nodes that are in the graph.
         */
        constructor(nodes: T[]);
        /**
         * @param edges A list of string tuples [a, b] representing
         * that an edge existing between a and b
         */
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
declare module "game/utils" {
    /**
     * Defines a set of utility functions & classes for logic for math, strings, etc.
     * @module
     */
    import Graph from "game/board/graph";
    /**
     * Returns a index from a weighted array.
     * @param weights An array of weights
     * @return The index to remove or -1 if no such index if weights are 0 or
     * array is empty.
     */
    export const weightedRandom: (weights: number[]) => number;
    /**
     * Roll a die.
     * @returns A uniform int on [1, 6]
     */
    export const rollDie: () => number;
    /**
     * @returns A uniform int on [lo, hi]
     */
    export const uniformRandom: (lo: number, hi: number) => number;
    /**
     * A recursive helper function to find the max trail.
     * @param v The current node.
     * @param g The graph.
     * @param seen A list of edges already visited.
     * @returns The length of the max trail.
     */
    export function maxTrailRec<T>(v: T, g: Graph<T>, seen: Graph<T>): number;
    /**
     * maxTrail explores every possible trail that starts at node `src` and
     * return the max length of all trials.
     * @param g The graph.
     * @param src The starting node.
     */
    export const maxTrail: <T>(g: Graph<T>, src: T) => number;
    /**
     * Get a list of graphs that are the connected components of graph `g`.
     * @param g The graph.
     * @returns A list of ccs.
     */
    export const connectedComponents: <T>(g: Graph<T>) => Graph<T>[];
    export interface BFSTraveral<T> {
        visited: Set<T>;
        depth: number;
    }
    /**
     * Run BFS on a graph from a source.
     * @param g The graph.
     * @param src The source elt.
     * @returns A BFS traversal object that includes a list of visited graph elts
     * and the max depth of the BFS tree.
     */
    export const breadthFirstSearch: <T>(g: Graph<T>, src: T) => BFSTraveral<T>;
}
declare module "game/loggable" {
    /**
     * Interface declaring the class loggable. Every class that
     * implements this interface must implement a method `toLog` which
     * returns a string of the class' state.
     */
    export interface Loggable {
        toLog: () => string;
    }
    export default Loggable;
}
declare module "game/resource/resource_bundle" {
    import Resource from "game/resource/resource";
    import Loggable from "game/loggable";
    /**
     * A collection of resources.
     */
    export class ResourceBundle implements Loggable {
        private bundle;
        /**
         * Initializes an empty bundle.
         */
        constructor();
        /**
         * Initialize a bundle with `amnt` of each resource.
         * @param amnt The amount we want of each resource.
         */
        constructor(amnt: number);
        /**
         * Initialize a bundle with `amnt[i]` of resource `i`.
         * @param amnts The amounts we want for each resource.
         */
        constructor(amnts: number[]);
        /**
         * Determine if `bundle` is a subset of this bundle.
         * @param bundle
         * @returns boolean indicating if `bundle` is a subset.
         */
        has(bundle: ResourceBundle): boolean;
        /**
         *
         * @param resource The resource we want the amount of.
         * @returns The number of resource `resource` in the bundle.
         */
        get(resource: Resource): number;
        /**
         * Set the amount of a resource to resource.
         * @param resource The resource to set the amount of.
         * @param amnt The amount.
         */
        set(resource: Resource, amnt: number): void;
        /**
         *
         * @param bundle The bundle we wish to add to this bundle. It is unchanged.
         */
        add(bundle: ResourceBundle): void;
        /**
         *
         * @param resource The resource we with to add to this bundle.
         * @param amnt The amount of the resource we wish to add.
         */
        add(resource: Resource, amnt: number): void;
        /**
         *
         * @param bundle The bundle we with to subtract from this bundle. It is unchanged.
         */
        subtract(bundle: ResourceBundle): void;
        subtract(resource: Resource, amnt: number): void;
        /**
         * Make a trade between two bundles.
         * @param fromOffereeBundle What is expected in return from the offeree.
         * @param offereeBundle The offeree's bundle.
         * @param fromOffererBundle What is offered by the offerer.
         * @param offererBundle The offerer's bundle.
         */
        static trade(fromOffereeBundle: ResourceBundle, offereeBundle: ResourceBundle, fromOffererBundle: ResourceBundle, offererBundle: ResourceBundle): void;
        /**
         * Get the amount of Resource `resource` held by the bundle and set it to 0.
         * @param resource The resource we want to take.
         * @returns The amount of `resource` the bundle had.
         */
        removeAll(resource: Resource): number;
        /**
         * Remove one resource from the bundle at random.
         * @returns The resource that was randomly removed.
         */
        removeOneAtRandom(): Resource;
        /**
         *
         * @returns The number of resources in the bundle.
         */
        size(): number;
        /**
         *
         * @returns A boolean indicating if the bundle has no resources.
         */
        isEmpty(): boolean;
        static roadCost: ResourceBundle;
        static settlementCost: ResourceBundle;
        static cityCost: ResourceBundle;
        static devCardCost: ResourceBundle;
        toLog: () => string;
    }
    export default ResourceBundle;
}
declare module "game/trade_offer" {
    import ResourceBundle from "game/resource/resource_bundle";
    export enum TradeStatus {
        Pending = 0,
        Accept = 1,
        Decline = 2
    }
    export class TradeOffer {
        /** Unique number for the trade offer */
        readonly id: number;
        /** Player number who is making the offer. */
        readonly offerer: number;
        /** What is offered. */
        readonly offer: ResourceBundle;
        /** What is requested in return. */
        readonly request: ResourceBundle;
        /** How each player number views the trade. */
        readonly status: TradeStatus[];
        constructor(id: number, offerer: number, offer: ResourceBundle, request: ResourceBundle);
        allDeclined: () => boolean;
    }
    export default TradeOffer;
}
declare module "game/action" {
    /**
     * Declares and defines all possible actions.
     * @module
     */
    import DevCard from "game/dev_card/dev_card";
    import Resource from "game/resource/resource";
    import ResourceBundle from "game/resource/resource_bundle";
    import { TradeStatus } from "game/trade_offer";
    /**
     * All possible types of actions.
     */
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
        /** What is the actual offer lol */
        offer: ResourceBundle;
        request: ResourceBundle;
    }
    export interface TradeOfferDecisionPayload extends ActionPayload {
        /** The decision. */
        status: TradeStatus;
        /** The id of the trade. */
        id: number;
        /** The player we are agreeing to do the trade with. Only needed by host. */
        withPlayer?: number;
    }
    export interface DiscardPayload extends ActionPayload {
        /** The bundle we'll be discarding */
        bundle: ResourceBundle;
    }
    export interface DrawDevCardPayload extends ActionPayload {
        /** The card we draw */
        card: DevCard;
    }
    export interface RollPayload extends ActionPayload {
        /** the value of the dice sum. */
        value: number;
    }
    export interface MoveRobberPayload extends ActionPayload {
        /** The tile number we want to move the robber to. */
        to: number;
    }
    export interface RobPayload extends ActionPayload {
        /** The number of the player we want to rob. */
        victim: number;
    }
    export interface SelectMonopolyResourcePayload extends ActionPayload {
        /** The resource we want to monopoly. */
        resource: Resource;
    }
    export interface SelectYearOfPlentyResourcesPayload extends ActionPayload {
        /** The resources we want to get. */
        resources: [Resource, Resource];
    }
    export interface BuildSettlementPayload extends ActionPayload {
        /** The node number we want to build a settlement on. */
        node: number;
    }
    export interface BuildCityPayload extends ActionPayload {
        /** The node number we want to build a city on. */
        node: number;
    }
    export interface BuildRoadPayload extends ActionPayload {
        /** The edge number we want to build a settlement on. */
        node0: number;
        node1: number;
    }
    /**
     * An action is a request to change the game's state in some way
     * such as by rolling the die, accepting a trade offer, playing a development card, etc.
     *
     * All actions are **verifiable**, meaning they can (and always are) checked to
     * be valid actions given the current game state. i.e. you can't roll twice on a turn.
     *
     * Actions link between turn states in the turn state finite state machine.
     *
     * A verified action can be applied to game state to update it in a safe and predictable
     * manner.
     */
    export class Action {
        /** The type of the action. */
        readonly type: ActionType;
        /** Any additional data needed to convey the desired action. */
        readonly payload: ActionPayload;
        /** The player number who is requesting the action. */
        readonly player: number;
        constructor(type: ActionType, player?: number, payload?: ActionPayload);
        serialized: () => string;
        static deserialize: (serializedObj: string) => Action;
    }
    export default Action;
}
declare module "game/dev_card/dev_card_bundle" {
    import DevCard from "game/dev_card/dev_card";
    import Loggable from "game/loggable";
    /**
     * A collection of devcards.
     */
    export class DevCardBundle implements Loggable {
        private bundle;
        /**
         * Initializes an empty bundle.
         */
        constructor();
        /**
         * Initialize a bundle with `amnt` of each devcard.
         * @param amnt The amount we want of each devcard.
         */
        constructor(amnt: number);
        /**
         * Initialize a bundle with `amnt[i]` of devcard `i`.
         * @param amnts The amounts we want for each devcard.
         */
        constructor(amnts: number[]);
        /**
         * Add a single devcard to the bundle.
         * @param devcard The dev card to add one of.
         */
        add(devcard: DevCard): void;
        /**
         * Remove a single devcard from the bundle.
         * @param devcard The dev card to remove one of.
         */
        remove(devcard: DevCard): void;
        /**
         * Check if we have a dev card
         * @param devcard The dev card to check for.
         * @returns boolean indicating if we have this dev card.
         */
        has(devcard: DevCard): boolean;
        /**
         * Pick one devcard from the bundle at random.
         * @returns The devcard that was randomly picked.
         */
        pickOneAtRandom(): DevCard;
        /**
         *
         * @returns The number of devcards in the bundle.
         */
        size(): number;
        /**
         *
         * @returns A boolean indicating if the bundle has no devcards.
         */
        isEmpty(): boolean;
        toLog: () => string;
    }
    export default DevCardBundle;
}
declare module "game/player" {
    import DevCardBundle from "game/dev_card/dev_card_bundle";
    import Loggable from "game/loggable";
    import ResourceBundle from "game/resource/resource_bundle";
    export class Player implements Loggable {
        /** The players resources. */
        readonly resources: ResourceBundle;
        /** The rates at which a player can exchange a resource for any with the bank. */
        readonly rates: ResourceBundle;
        /** The players dev cards. */
        readonly devCards: DevCardBundle;
        /** Knights player. */
        knightsPlayed: number;
        /** Number of victory points. */
        victoryPoints: number;
        /** Number of cities that can be built. */
        cities: number;
        /** Number of settlements that can be built.  */
        settlements: number;
        /** Number of roads that can be built. */
        roads: number;
        constructor();
        toLog: () => string;
    }
    export default Player;
}
declare module "game/turn_fsm" {
    /**
     * The Finite State Machine for transitioning between turn states based on actions.
     * @module
     */
    import { Action } from "game/action";
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
    /**
     * Determines if an action may even be considered given the current state.
     * i.e. you can't do a roll action if turn state is `TurnState.Postroll`
     * @param state The current turn state
     * @param action The desired action
     * @returns boolean indicating whether given this turn state, this action is even allowed.
     */
    export const isValidTransition: (state: TurnState, action: Action) => boolean;
    export default isValidTransition;
}
declare module "game/board/port" {
    import Resource from "game/resource/resource";
    class Port {
        /** List of resources willing to be exchanged at `rate` for one. */
        readonly resources: Resource[];
        /** Takes `rate` of a resource in `resources` in exchange for 1 other resource. */
        readonly rate: number;
        constructor(resources: Resource[], rate: number);
    }
    export default Port;
}
declare module "game/board/node" {
    import Loggable from "game/loggable";
    import Port from "game/board/port";
    /**
     * A node on our board.
     */
    export class Node implements Loggable {
        /** The player number who has built on this node. -1 if none. */
        private player;
        /** If the node has a city. */
        private city;
        /** The node's port or null if none. Set at initialization. */
        private port;
        /**
         * Convenience method to check if node is empty.
         * Preferrable to `node.getPlayer() === -1` everywhere.
         * @returns True if empty.
         */
        isEmpty: () => boolean;
        /**
         * @returns The port object or null if no port.
         */
        getPort: () => Port | null;
        /**
         * @returns The number of the player on this node, -1 if none.
         */
        getPlayer: () => number;
        /**
         * @returns Boolean indicating if this node has a city.
         */
        hasCity: () => boolean;
        /**
         * Build a settlement on this node.
         * @param player The settlement's player number.
         */
        buildSettlement(player: number): void;
        /**
         * Upgrade a settlement to a city on this node.
         */
        buildCity(): void;
        /**
         * Set the port. Can only be done once.
         * @param port The port to set.
         */
        setPort(port: Port): void;
        toLog: () => string;
    }
    export default Node;
}
declare module "game/board/tile" {
    import Loggable from "game/loggable";
    import Resource from "game/resource/resource";
    /**
     * A tile on the board.
     */
    export class Tile implements Loggable {
        /** The resource of the tile. Set once at initialization. */
        readonly resource: Resource;
        /** The nodeids of the nodes incident on this tile. Set once at initialization. */
        readonly nodes: number[];
        /** The number of the tile. Used in calculating resource production. */
        private number;
        constructor(resource: Resource, nodes: number[]);
        /**
         * Set the number for the tile. This can only be done once.
         * @param number The value we want to set.
         */
        setNumber(number: number): void;
        getNumber: () => number;
        /**
         * Check if a tile is adjacent to this tile.
         * @param other The other tile.
         * @returns true if this tile is adjacent to `other`
         */
        isAdjacentTo(other: Tile): boolean;
        toLog: () => string;
    }
    export default Tile;
}
declare module "game/board/board" {
    import Node from "game/board/node";
    import Tile from "game/board/tile";
    import Graph from "game/board/graph";
    import Loggable from "game/loggable";
    /**
     * A game board. The board manages the internal logic
     * for the underlying undirected graph and its own state.
     * It is **agnostic** of game state and will never check if
     * a call to its public interface violates game state.
     */
    export class Board implements Loggable {
        /** List of node objects, indexable by node number. */
        readonly nodes: Node[];
        /** Graph of nodes. Edge weight -1 indicates connection edge weight > -1 indicates road
         * for the player number of that weight.
         */
        readonly roadnetwork: Graph<number>;
        /** List of tiles objects indexable by tile number. */
        readonly tiles: Tile[];
        /** The tile number the robber is on. */
        robber: number;
        constructor();
        private generateRoadNetwork;
        private generateNodes;
        private generateTiles;
        /**
         * Given a connected graph g find its longest trail.
         * @param g The graph. Every node degree is on [0, 3].
         * @returns The length of the longest trail.
         */
        private longestRoadOn;
        /**
         * Calculates the longest road length of player `player`.
         * @param player The player number to check.
         * @returns Length in number of roads.
         */
        getLongestRoad(player: number): number;
        /**
         * Get players who can be robbed.
         * @returns List of player numbers who have structures on nodes incident on
         * the robber tile.
         */
        playersOnRobber(): number[];
        /**
         * Build a road for player number `player`, if one doesn't already
         * exist, between nodes `nid0` and `nid1`.
         * @param nid0 First node.
         * @param nid1 Second node.
         * @param player The player number.
         */
        buildRoad(nid0: number, nid1: number, player: number): void;
        /**
         * Get the player number for a road between two nodes.
         * @param nid0 First node.
         * @param nid1 Second node.
         * @returns -1 If no road or if the nodes aren't adjacent. The player number
         * of the road otherwise.
         */
        getRoad(nid0: number, nid1: number): number;
        /**
         * Get all adjacent nodes.
         * @param nid The node id we want to get the adjacent nodes for.
         * @returns List of adjacent node ids.
         */
        adjacentTo: (nid: number) => number[];
        toLog: () => string;
    }
    export default Board;
}
declare module "game/game" {
    import Action from "game/action";
    import Loggable from "game/loggable";
    /**
     * Enum of game phases.
     */
    export enum GamePhase {
        SetupForward = "Forward Setup",
        SetupBackward = "Backward Setup",
        Playing = "Playing",
        Finished = "Finished"
    }
    export class Game implements Loggable {
        /** A resource bundle for the bank. */
        private bank;
        /** The dev card deck. */
        private deck;
        /** The board. */
        private board;
        /** The current turn number takes on a value of: [0, NUM_PLAYERS] */
        turn: number;
        /** The last roll */
        private lastRoll;
        /** List of player objects. Indexable by player number. */
        private players;
        /** A list of open trade offers in the current turn. */
        private tradeOffers;
        /** The current phase of the game. */
        private phase;
        /** The winner. */
        private winner;
        /** The current turn's state, i.e. Postroll, preroll, etc. */
        private turnState;
        /** The number of roads the current turn's player can place for no cost. */
        private freeRoads;
        /** Boolean list of players who still need to submit discard actions. */
        private mustDiscard;
        /** Boolean indicating if we have rolled on the current turn yet. */
        private hasRolled;
        /** [owner, amount] of largest army. */
        private largestArmy;
        /** [owner, length] of longest road */
        private longestRoad;
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
        /**
         * Check if an action is valid.
         * @param action The action requested to be done
         * @returns Boolean indicating if the action is valid.
         */
        isValidAction(action: Action): boolean;
        /**
         * (1) Check if an action is valid, (2) make action deterministic (edge cases),
         * then (3) do the action.
         * @param action The action to be handled.
         * @returns `null` if `action` is invalid, the completed, valid action otherwise.
         */
        handleAction(action: Action): null | Action;
        toLog: () => string;
    }
    export default Game;
}
declare module "cli" { }
