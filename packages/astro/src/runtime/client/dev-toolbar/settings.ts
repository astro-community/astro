export interface Settings {
	disableAppNotification: boolean;
	verbose: boolean;
}

export const defaultSettings = {
	disableAppNotification: false,
	verbose: false,
} satisfies Settings;

export const settings = getSettings();

function getSettings() {
	let _settings: Settings = { ...defaultSettings };
	const toolbarSettings = localStorage.getItem('astro:dev-toolbar:settings');

	// TODO: Remove in Astro 5.0
	const oldSettings = localStorage.getItem('astro:dev-overlay:settings');
	if (oldSettings && !toolbarSettings) {
		localStorage.setItem('astro:dev-toolbar:settings', oldSettings);
		localStorage.removeItem('astro:dev-overlay:settings');
	}

	if (toolbarSettings) {
		_settings = { ..._settings, ...JSON.parse(toolbarSettings) };
	}

	function updateSetting(key: keyof Settings, value: Settings[typeof key]) {
		_settings[key] = value;
		localStorage.setItem('astro:dev-toolbar:settings', JSON.stringify(_settings));
	}

	function log(message: string) {
		// eslint-disable-next-line no-console
		console.log(
			`%cAstro`,
			'background: linear-gradient(66.77deg, #D83333 0%, #F041FF 100%); color: white; padding-inline: 4px; border-radius: 2px; font-family: monospace;',
			message
		);
	}

	return {
		get config() {
			return _settings;
		},
		updateSetting,
		log,
	};
}
