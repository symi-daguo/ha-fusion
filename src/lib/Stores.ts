import { writable, derived } from 'svelte/store';
import { createConnection, createLongLivedTokenAuth, subscribeEntities } from 'home-assistant-js-websocket';
import type { Connection } from 'home-assistant-js-websocket';
import type { HassEntity } from 'home-assistant-js-websocket';
import type { PersistentNotification } from '$lib/types/types';
import type { KonvaStore, KonvaImageCache } from '$lib/types/types';

// connection
export const connection = writable<Connection | null>(null);
export const connected = writable<boolean>(false);

// states
export const states = writable<{ [entityId: string]: HassEntity }>({});

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

// 获取实体名称
function getName(name: string | undefined, entity: HassEntity | undefined): string {
	if (name) return name;
	if (!entity) return '';
	return entity.attributes?.friendly_name || '';
}
