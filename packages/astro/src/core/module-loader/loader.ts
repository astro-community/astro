import type TypedEmitter from '../../@types/typed-emitter';
import type * as fs from 'fs';
import { EventEmitter } from 'events';

// This is a generic interface for a module loader. In the astro cli this is
// fulfilled by Vite, see vite.ts

export type LoaderEvents = {
	'file-add': (msg: [path: string, stats?: fs.Stats | undefined]) => void;
	'file-change': (msg: [path: string, stats?: fs.Stats | undefined]) => void;
	'file-unlink': (msg: [path: string, stats?: fs.Stats | undefined]) => void;
	'hmr-error': (msg: {
		type: 'error',
		err: {
			message: string;
			stack: string
		};
	}) => void;
};

export type ModuleLoaderEventEmitter = TypedEmitter<LoaderEvents>;

export interface ModuleLoader {
	import: (src: string) => Promise<Record<string, any>>;
	resolveId: (specifier: string, parentId: string | undefined) => Promise<string | undefined>;
	getModuleById: (id: string) => ModuleNode | undefined;
	getModulesByFile: (file: string) => Set<ModuleNode> | undefined;
	getModuleInfo: (id: string) => ModuleInfo | null;

	eachModule(callbackfn: (value: ModuleNode, key: string) => void): void;
	invalidateModule(mod: ModuleNode): void;

	fixStacktrace: (error: Error) => void;

	clientReload: () => void;
	webSocketSend: (msg: any) => void;
	isHttps: () => boolean;
	events: TypedEmitter<LoaderEvents>;
}

export interface ModuleNode {
	id: string | null;
	url: string;
	ssrModule: Record<string, any> | null;
	ssrError: Error | null;
	importedModules: Set<ModuleNode>;
}

export interface ModuleInfo {
	id: string;
	meta?: Record<string, any>;
}

export function createLoader(overrides: Partial<ModuleLoader>): ModuleLoader {
	return {
		import() { throw new Error(`Not implemented`); },
		resolveId(id) { return Promise.resolve(id); },
		getModuleById() {return undefined },
		getModulesByFile() { return undefined },
		getModuleInfo() { return null; },
		eachModule() { throw new Error(`Not implemented`); },
		invalidateModule() {},
		fixStacktrace() {},
		clientReload() {},
		webSocketSend() {},
		isHttps() { return true; },
		events: new EventEmitter() as ModuleLoaderEventEmitter,

		...overrides
	};
}