import { setupSequelize } from '@core/category/infra/testing/helpers';
import { CastMemberModel } from '../cast-member.model';
import { CastMemberRepository } from '../cast-member.repository';
import { CastMember, CastMemberId, CastMemberType } from '@core/cast-member/domain/cast-member.entity';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { CastMemberSearchParams } from '@core/cast-member/domain/cast-member.repository.interface';

describe('CastMemberRepository integration tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  let repository: CastMemberRepository;

  beforeEach(async () => {
    repository = new CastMemberRepository(CastMemberModel);
  });

  it('should insert a cast member', async () => {
    const entity = CastMember.fake().aCastMember().build();

    await repository.insert(entity);

    const model = await CastMemberModel.findByPk(entity.cast_member_id.value);

    expect(model.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should create a bulk of cast member', async () => {
    const entities = CastMember.fake().theCastMembers(2).build();

    await repository.bulkInsert(entities);

    const models = await CastMemberModel.findAll();

    expect(models.map(model => model.toJSON())).toStrictEqual(entities.map(category => category.toJSON()));
  });

  it('should delete a category', async () => {
    const entity = CastMember.fake().aCastMember().build();

    await repository.insert(entity);

    await repository.delete(entity.cast_member_id);

    const model = await CastMemberModel.findByPk(entity.cast_member_id.value);

    expect(model).toBeNull();
  });

  it('should update a cast member', async () => {
    const entity = CastMember.fake().aCastMember().withType(CastMemberType.actor).build();

    await repository.insert(entity);

    entity.changeName('new name');
    entity.changeType(CastMemberType.director);

    await repository.update(entity);

    const model = await CastMemberModel.findByPk(entity.cast_member_id.value);

    expect(model.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should throw an error when trying to update a non-existing cast member', async () => {
    const entity = CastMember.fake().aCastMember().build();

    await expect(repository.update(entity)).rejects.toThrow(NotFoundError);
  });

  it('should throw an error when trying to delete a non-existing cast member', async () => {
    const entity = CastMember.fake().aCastMember().build();

    await expect(repository.delete(entity.cast_member_id)).rejects.toThrow(NotFoundError);
  });

  it('should find a category by id', async () => {
    const entity = CastMember.fake().aCastMember().build();

    await repository.insert(entity);

    const foundCategory = await repository.findById(entity.cast_member_id);

    expect(foundCategory).toStrictEqual(entity);
  });

  it('should return null when trying to find by no-existing id', async () => {
    const entity = await repository.findById(new CastMemberId());
    expect(entity).toBeNull();
  });

  it('should return all cast members', async () => {
    const entity1 = CastMember.fake().aCastMember().build();
    const entity2 = CastMember.fake().aCastMember().build();
    const entity3 = CastMember.fake().aCastMember().build();

    await repository.bulkInsert([entity1, entity2, entity3]);

    const entities = await repository.findAll();

    expect(entities).toHaveLength(3);
    expect(JSON.stringify(entities)).toEqual(JSON.stringify([entity1, entity2, entity3]));
  });

  it('should search cast members', async () => {
    const entity1 = CastMember.fake().aCastMember().withName('raphael').build();
    const entity2 = CastMember.fake().aCastMember().withName('mayara').build();
    const entity3 = CastMember.fake().aCastMember().withName('camila').build();

    await repository.bulkInsert([entity1, entity2, entity3]);

    const searchResult = await repository.search(new CastMemberSearchParams({ filter: 'mayara' }));

    expect(searchResult.items).toHaveLength(1);
    expect(searchResult.toJSON({ forceEntity: true })).toStrictEqual({
      items: [entity2.toJSON()],
      total: 1,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should search cast members with pagination and sort', async () => {
    const entity1 = CastMember.fake().aCastMember().withName('movie').build();
    const entity2 = CastMember.fake().aCastMember().withName('serie').build();
    const entity3 = CastMember.fake().aCastMember().withName('anime').build();

    await repository.bulkInsert([entity1, entity2, entity3]);

    const searchResult = await repository.search(
      new CastMemberSearchParams({ per_page: 1, sort: 'name', sort_direction: 'asc' }),
    );

    expect(searchResult.items).toHaveLength(1);
    expect(searchResult.toJSON({ forceEntity: true })).toStrictEqual({
      items: [entity3.toJSON()],
      total: 3,
      current_page: 1,
      per_page: 1,
      last_page: 3,
    });
  });

  it('should search cast members with filter, pagination and sort', async () => {
    const entity1 = CastMember.fake().aCastMember().withName('movie').build();
    const entity2 = CastMember.fake().aCastMember().withName('serie').build();
    const entity3 = CastMember.fake().aCastMember().withName('anime').build();

    await repository.bulkInsert([entity1, entity2, entity3]);

    const searchResult = await repository.search(
      new CastMemberSearchParams({
        filter: 'movie',
        per_page: 1,
        sort: 'name',
        sort_direction: 'asc',
      }),
    );

    expect(searchResult.items).toHaveLength(1);
    expect(searchResult.toJSON({ forceEntity: true })).toStrictEqual({
      items: [entity1.toJSON()],
      total: 1,
      current_page: 1,
      per_page: 1,
      last_page: 1,
    });
  });

  it('should search categories with pagination', async () => {
    const entity1 = CastMember.fake().aCastMember().withName('movie').withCreatedAt(new Date('2024-12-03')).build();
    const entity2 = CastMember.fake().aCastMember().withName('serie').withCreatedAt(new Date('2024-12-01')).build();
    const entity3 = CastMember.fake().aCastMember().withName('anime').withCreatedAt(new Date('2024-12-02')).build();

    await repository.bulkInsert([entity1, entity2, entity3]);

    const searchResult = await repository.search(new CastMemberSearchParams({ per_page: 2 }));

    expect(searchResult.items).toHaveLength(2);
    expect(searchResult.toJSON({ forceEntity: true })).toStrictEqual({
      items: [entity1.toJSON(), entity3.toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
