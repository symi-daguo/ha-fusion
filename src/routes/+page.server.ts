import { readFile } from 'fs/promises';
import { dev } from '$app/environment';
import yaml from 'js-yaml';
import type { PageServerLoad } from './$types';

interface Configuration {
	locale?: string;
	hassUrl?: string;
	token?: string;
	custom_js?: boolean;
	motion?: boolean;
	addons?: {
		youtube?: boolean;
		maptiler?: {
			apikey: string;
		};
	};
}

interface Dashboard {
	views: any[];
	theme?: string;
	sidebar?: any[];
	hide_views?: boolean;
	hide_sidebar?: boolean;
	sidebarWidth?: number;
}

export const load: PageServerLoad = async () => {
	try {
		// 加载配置
		const configFile = await readFile('./data/configuration.yaml', 'utf8');
		const configuration = yaml.load(configFile) as Configuration;

		// 加载仪表板
		const dashboardFile = await readFile('./data/dashboard.yaml', 'utf8');
		const dashboard = yaml.load(dashboardFile) as Dashboard;

		// 确定翻译文件目录
		const translationsDir = dev ? './static/translations' : './build/client/translations';

		// 加载英文翻译作为基础
		const enTranslationFile = await readFile(`${translationsDir}/en.json`, 'utf8');
		const enTranslations = JSON.parse(enTranslationFile);

		// 如果有其他语言设置，加载对应的翻译
		let translations = enTranslations;
		if (configuration?.locale && configuration.locale !== 'en') {
			try {
				const localeTranslationFile = await readFile(`${translationsDir}/${configuration.locale}.json`, 'utf8');
				const localeTranslations = JSON.parse(localeTranslationFile);
				translations = { ...localeTranslations, _default: enTranslations };
			} catch (error) {
				console.warn(`Failed to load translation for ${configuration.locale}, falling back to English:`, error);
			}
		}

		// 加载主题
		let theme;
		if (dashboard?.theme) {
			const themeFile = await readFile(`${dev ? './static' : './build/client'}/themes/${dashboard.theme}.yaml`, 'utf8');
			theme = yaml.load(themeFile);
		}

		return {
			configuration,
			dashboard,
			translations,
			theme
		};
	} catch (error) {
		console.error('Failed to load initial data:', error);
		return {
			configuration: {} as Configuration,
			dashboard: { views: [] } as Dashboard,
			translations: {},
			theme: {}
		};
	}
};
