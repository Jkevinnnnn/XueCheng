import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import { dictionaryAll, ISystemDictionary } from '@/api/systems';
// import { getToken, setToken, removeToken } from '@/utils/cookies';
import store from '@/store';

export interface ISystemState {
	dicts: ISystemDictionary[];
}

@Module({ dynamic: true, store, name: 'system' })
class System extends VuexModule implements ISystemState {
	public dicts: ISystemDictionary[] = [];

	@Mutation
	private SET_DICTS(dicts: ISystemDictionary[]) {
		this.dicts = dicts;
	}

	@Action
	public async getDicts() {
		let dicts: ISystemDictionary[] = [];
		try {
			dicts = await dictionaryAll();
		} catch (error) {
			console.warn('Failed to load dictionaries, continue with empty dicts.', error);
		}
		this.SET_DICTS(dicts);
	}
}

export const SystemModule = getModule(System);
