import { writable, readable, derived } from 'svelte/store';
import type {
	Configuration,
	Dashboard,
	PersistentNotification,
	Template,
	Translations,
	Views,
	KonvaStore,
	KonvaImageCache
} from '$lib/Types';
import type {
	Connection,
	HassConfig,
	HassEntities,
	HassServices
} from 'home-assistant-js-websocket';
import { getName } from './Utils';
import {
	createConnection,
	createLongLivedTokenAuth,
	subscribeEntities,
	type Connection,
	type HassEntities
} from 'home-assistant-js-websocket';

// hass
export const connection = writable<any | null>(null);
export const config = writable<HassConfig>();
export const states = writable<any>({});
export const services = writable<HassServices>();
export const connected = writable(false);

// user
export const configuration = writable<{
	token?: string;
	locale?: string;
	motion?: boolean;
	custom_js?: boolean;
	addons?: {
		youtube?: boolean;
		maptiler?: {
			apikey: string;
		};
	};
	fullscreen?: boolean;
}>();
export const dashboard = writable<Dashboard>();
export const customJs = writable<boolean | undefined>();

// states
export const onStates = readable([
	'active',
	'auto',
	'cool',
	'dry',
	'fan_only',
	'heat',
	'heat_cool',
	'heating',
	'home',
	'on',
	'open',
	'playing',
	'unlocking',
	'unlocked',
	// vacuum
	'cleaning',
	'returning',
	// water_heater
	'eco',
	'electric',
	'performance',
	'high_demand',
	'heat_pump',
	'gas'
]);

// climate states
export const climateHvacActionToMode = readable<Record<string, string>>({
	cooling: 'cool',
	drying: 'dry',
	fan: 'fan_only',
	preheating: 'heat',
	heating: 'heat',
	idle: 'off',
	off: 'off'
});

// drawer
export const drawerSearch = writable<string | undefined>();
export const focusSearch = writable<boolean>(false);
export const filterDashboard = writable<Views>({});
export const disableMenuButton = writable<boolean>(false);
export const clickOriginatedFromMenu = writable<boolean>(false);

// global
export const editMode = writable(false);
export const showDrawer = writable(false);
export const motion = writable(190);
export const itemHeight = readable(61.35);

// language
export const translation = writable<Translations>({});
export const selectedLanguage = writable<string>();
export const lang = derived(
	translation,
	(obj: Translations & { _default?: Record<string, string> }) => (key: string) =>
		obj[key] || obj._default?.[key] || key
);

// views
export const currentViewId = writable<number | undefined>();
export const draggingView = writable<boolean>(false);
export const viewUnderline = writable<boolean>(true);
export const highlightView = writable<boolean>(false);

// sidebar
export const timers = writable<{ [key: string]: { pausedState: string } }>({});
export const barErrors = writable<{ [key: string]: string }>({});
export const forecasts = writable<{ [key: string]: any }>({});
export const templates = writable<Template>({});
export const demo = writable<{ [key: string]: string | undefined }>({
	graph: undefined,
	sensor: undefined,
	timer: undefined,
	bar: undefined,
	radial: undefined,
	camera: undefined,
	history: undefined
});

// youtube_addon
export const youtubeAddon = writable<boolean | undefined>();
export const youtubeData = writable<{
	media_artist: string;
	media_title: string;
	entity_picture: string;
}>();

// history
export const history = writable<string[]>([]);
export const historyIndex = writable<number>(0);
export const record = writable<() => void>(() => {});
export function historyUpdater(func: () => void) {
	record.set(func);
}

// time/date
export const timer = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);
	set(new Date());
	return function stop() {
		clearInterval(interval);
	};
});

// ripple
export const ripple = writable({
	color: 'rgba(255, 255, 255, 0.35)',
	opacity: 0.35,
	spreadingDuration: '400ms',
	spreadingDelay: '0s',
	spreadingTimingFunction: 'linear',
	clearingDuration: '400ms',
	clearingDelay: '0s',
	clearingTimingFunction: 'linear'
});

// calendar
export const calendarView = writable<string | null>();
export const calendarFirstDay = writable<number>();

// dnd
export const dragging = writable<boolean>(false);

// codemirror
export const autocompleteOpen = writable(false);
export const autocompleteList = derived(states, ($states) => Object.keys($states));
export const pasteContent = writable<string | undefined>();

// entity select
export const entityList = derived(
	states,
	($states) => (filter: string) =>
		Object.keys($states)
			?.filter((key) => (filter.length > 0 ? key.startsWith(`${filter}.`) : true))
			?.sort()
			?.map((key) => {
				const name = getName(undefined, $states?.[key]);
				return {
					id: key,
					label: name ?? key,
					hint: name === key ? undefined : key
				};
			})
);

// event
export const event = writable<string | undefined>();
export const persistentNotifications = writable<{
	[notificationId: string]: PersistentNotification;
}>({});

// konva
export const konvaImageCache = writable<KonvaImageCache>({});

export const konvaStore = writable<KonvaStore>({
	children: [],
	selectedShapes: [],
	mode: 'default',
	undoStack: [],
	redoStack: []
});

// HA 实例管理
interface HAInstance {
	url: string;
	name: string;
	tokens?: {
		access_token: string;
		refresh_token: string;
		expires_in: number;
		timestamp: number;
	};
}

// 存储多个 HA 实例信息
export const haInstances = writable<HAInstance[]>([]);
export const currentInstance = writable<HAInstance | null>(null);

// 初始化 HA 连接
export async function initConnection() {
	try {
		// 1. 获取 token
		const tokens = localStorage.getItem('hassTokens');
		if (!tokens) {
			console.error('No access token found');
			return;
		}

		const { access_token } = JSON.parse(tokens);
		
		// 2. 创建连接
		const auth = createLongLivedTokenAuth(
			window.location.origin,
			access_token
		);

		const conn = await createConnection({ 
			auth,
			setupRetry: 10
		});
		
		// 3. 更新状态
		connection.set(conn);
		connected.set(true);

		// 4. 订阅实体更新
		subscribeEntities(conn, (ents) => {
			console.log('Received entities:', Object.keys(ents).length);
			states.set(ents);
		});

	} catch (err) {
		console.error('Failed to connect to Home Assistant:', err);
		connected.set(false);
		connection.set(null);
	}
}

// 添加实例管理函数
export function addHAInstance(instance: HAInstance) {
	haInstances.update(instances => {
		const newInstances = [...instances];
		const existingIndex = newInstances.findIndex(i => i.url === instance.url);
		if (existingIndex >= 0) {
			newInstances[existingIndex] = instance;
		} else {
			newInstances.push(instance);
		}
		localStorage.setItem('haInstances', JSON.stringify(newInstances));
		return newInstances;
	});
}

export function switchHAInstance(url: string) {
	haInstances.subscribe(instances => {
		const instance = instances.find(i => i.url === url);
		if (instance) {
			localStorage.setItem('currentInstanceId', url);
			initConnection(instance);
		}
	});
}
