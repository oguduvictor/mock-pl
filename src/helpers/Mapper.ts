export class Mapper {
	static map<F, T>(object: F): T {
		return JSON.parse(JSON.stringify(object)) as T;
	}
}
