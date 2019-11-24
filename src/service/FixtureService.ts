import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Fixture } from '../entity/Fixture';
import { Service } from 'typedi';

@Service()
export class FixtureService {
	constructor(
		@InjectRepository(Fixture)
		private fixtureRepository: Repository<Fixture>
	) {}

	getAll = (): Promise<Fixture[]> => this.fixtureRepository.find();

	getOne = (id: string): Promise<Fixture> =>
		this.fixtureRepository.findOne(id);

	save = (fixture: Fixture): Promise<Fixture> =>
		this.fixtureRepository.save(fixture);

	delete = async (id: string): Promise<void> => {
		const fixture = await this.getOne(id);

		await this.fixtureRepository.remove(fixture);
	};

	//generateLink = async ()
}
